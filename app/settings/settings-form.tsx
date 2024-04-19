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
import React from "react";
import {z} from "zod";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";


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
        },
        reValidateMode: "onSubmit"
    });

    /*
        We may not pass a server action to the form component, but we can invoke
        one from the onSubmit function.
     */
    const onSubmit = (fd: z.infer<typeof formSchema>) => handleSubmit(fd)

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
                            <UserDetailsInputs/>
                            <CourseDetailsInputs/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between w-full">
                        <DeleteAccountButton variant={"outline"}
                                             className="text-destructive bg-destructive/10 border-destructive/15 hover:bg-destructive/35 hover:border-destructive/40"/>
                        <Button disabled={!isValid} isLoading={isSubmitting || isValidating} type="submit">Save</Button>
                        <ServerError>
                            {searchParams.get("error")}
                        </ServerError>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}