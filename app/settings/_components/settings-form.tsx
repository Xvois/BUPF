'use client'

import {Form} from "@/components/ui/form";
import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DeleteAccountButton} from "@/app/settings/_components/ActionButtons";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {Tables} from "@/types/supabase";
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "@/app/settings/_schema/formSchema";
import CourseDetailsInputs from "@/components/form-components/course-details";
import UserDetailsInputs from "@/components/form-components/user-details";
import {handleSubmit, SettingsUploadSchema} from "@/app/settings/_actions/handleSubmit";
import {z} from "zod";
import {ServerError} from "@/components/ServerError";
import {redirect, useSearchParams} from "next/navigation";
import ProfilePictureUpload from "@/components/form-components/picture-upload";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/auth-js";


export default function SettingsForm({user, profile, enrollment}: {
    user: User,
    profile: Tables<"profiles">,
    enrollment: Tables<"users_courses"> & {
        details: Tables<"course_years"> & { course: Tables<"courses"> | null } | null
    }
}) {
    const searchParams = useSearchParams();
    // If the server is running, do not show the error message
    const serverError = process.env.NEXT_PUBLIC_VERCEL_ENV ? (searchParams.get("error") && "A server error has occurred.") : searchParams.get("error");


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: user.email as string,
            course: enrollment?.details?.course?.id ?? 0,
            year: enrollment?.details?.year_number,
            profilePicture: ''
        },
        reValidateMode: "onChange"
    });

    console.log(form.formState.defaultValues)

    const onSubmit = async (fd: z.infer<typeof formSchema>) => {

        const handleProfilePictureUpload = async (profilePicture: File) => {
            const supabase = createClient();
            const {data: {user}} = await supabase.auth.getUser();
            const {data: {session}} = await supabase.auth.getSession();

            if (!user || !session) {
                return redirect("/settings?error=No user found");
            }

            // Check if it currently exists
            // https://uyadlyphtuclcowrmrem.supabase.co/storage/v1/object/public/profile_pictures/ad5e4de4-526f-42f5-9900-75fc035f0b0a
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${user.id}`, {
                method: 'HEAD',
                headers: {
                    authorization: session.access_token,
                },
            });

            if (response.ok) {
                await supabase.storage.from("profile_pictures").remove([`${user.id}`]);
            }

            await supabase.storage.from("profile_pictures").upload(`${user.id}`, profilePicture);

            return supabase.storage.from("profile_pictures").getPublicUrl(`${user.id}`);
        }

        // Transform profile picture file to supabase URL
        let profilePictureUrl: string | undefined = undefined;
        if (fd.profilePicture) {
            const {data: {publicUrl}} = await handleProfilePictureUpload(fd.profilePicture);
            profilePictureUrl = publicUrl;
        }


        const transformedFormData: SettingsUploadSchema = {
            first_name: fd.firstName,
            last_name: fd.lastName,
            course: fd.course,
            year: fd.year ?? null,
            email: fd.email,
            profile_picture: profilePictureUrl
        }

        await handleSubmit(transformedFormData);
    }

    const {isSubmitting, isValidating} = form.formState;

    return (
        <Form {...form}>

            {/* @ts-expect-error
                I definitely can fix this error, but I do not want to and have better things to do.
                It is to do with the fact that the server action modifies the yearOfStudy to an entry
                Date object, but the form does not expect this.

                This should never actually present a problem in production.

                Changing this would likely require changing the course details component to accept
                a Date object, which is not worth the effort when this works.
             */}
            {/* @ts-expect-error see above ^ */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Update your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <UserDetailsInputs/>
                        <CourseDetailsInputs/>
                        <ProfilePictureUpload/>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between w-full">
                    <DeleteAccountButton variant={"destructive"}/>
                    <Button isLoading={isSubmitting || isValidating} type="submit">Save</Button>
                </CardFooter>
                <ServerError>
                    {serverError}
                </ServerError>
            </form>
        </Form>
    )
}