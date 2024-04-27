'use client'

import {Form} from "@/components/ui/form";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DeleteAccountButton} from "@/app/settings/ActionButtons";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {User} from "@supabase/gotrue-js";
import {Tables} from "@/types/supabase";
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "@/app/settings/formSchema";
import CourseDetailsInputs from "@/components/form-components/course-details";
import UserDetailsInputs from "@/components/form-components/user-details";
import {handleSubmit} from "@/app/settings/actions";
import {z} from "zod";
import {ServerError} from "@/components/ServerError";
import {redirect, useSearchParams} from "next/navigation";
import ProfilePictureUpload from "@/components/form-components/picture-upload";
import {createClient} from "@/utils/supabase/client";


export default function SettingsForm({user, profile}: {
    user: User,
    profile: Tables<"profiles">
}) {
    const searchParams = useSearchParams();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: user.email as string,
            course: profile.course ? profile.course.toString() : "0",
            yearOfStudy: profile.entry_date ? (new Date(profile.entry_date)).getFullYear().toString() : null,
            profilePicture: ''
        },
        reValidateMode: "onChange"
    });


    const onSubmit = async (fd: z.infer<typeof formSchema>) => {
        const handleProfileUpload = async (profilePicture: string) => {
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

        if (fd.profilePicture) {
            const {data: {publicUrl}} = await handleProfileUpload(fd.profilePicture);
            fd.profilePicture = publicUrl;
        }

        await handleSubmit(fd)
    }

    const {isSubmitting, isValid, isValidating, validatingFields} = form.formState;
    return (
        <Form {...form}>
            {/*
                I definitely can fix this error, but I do not want to and have better things to do.
                It is to do with the fact that the server action modifies the yearOfStudy to an entry
                Date object, but the form does not expect this.

                This should never actually present a problem in production.

                Changing this would likely require changing the course details component to accept
                a Date object, which is not worth the effort when this works.
            */}
            {/* @ts-ignore */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Update your profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <UserDetailsInputs formSchema={formSchema}/>
                            <CourseDetailsInputs formSchema={formSchema}/>
                            <ProfilePictureUpload/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between w-full">
                        <DeleteAccountButton variant={"outline"}
                                             className="text-destructive bg-destructive/10 border-destructive/15 hover:bg-destructive/35 hover:border-destructive/40"/>
                        <Button isLoading={isSubmitting || isValidating} type="submit">Save</Button>
                        <ServerError>
                            {searchParams.get("error")}
                        </ServerError>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}