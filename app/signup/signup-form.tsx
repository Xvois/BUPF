'use client'

import {Form} from "@/components/ui/form";
import {useForm, useFormContext} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {formSchema} from "@/app/signup/formSchema";
import React from "react";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import UserDetailsInputs from "@/components/form-components/user-details";
import CourseDetailsInputs from "@/components/form-components/course-details";
import PasswordConfirmation from "@/components/form-components/password-confirmation";


export default function SignupForm(props: { signUp: (fd: z.infer<typeof formSchema>) => Promise<void> }) {

    const searchParams = useSearchParams();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        /*
        This pattern is so stupid: react-hook-form wants to invoke
        a client function and onSubmit must be used for validation.
        This leads to this mess where a server action is invoked
        through this function.
         */
        await props.signUp(values);
    }

    const pageSchema =
        [
            ["firstName", "lastName", "email"],
            ["course", "yearOfStudy"],
            ["password", "confirmPassword"]
        ]

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col items-end space-y-8"}>
                <MultiStageForm pageSchema={pageSchema}>
                    <UserDetailsInputs formSchema={formSchema}/>
                    <CourseDetailsInputs formSchema={formSchema}/>
                    <PasswordConfirmation formSchema={formSchema}/>
                </MultiStageForm>
            </form>
            <ServerError className={"w-full"}>
                {searchParams.get("error")}
            </ServerError>
        </Form>
    )
}

/*
Conditionally renders a form with multiple stages.
Form stages should be supplied as children.
Form context is used to manage form state, so a form
wrapper is expected.

An optional custom page schema can be supplied to
help provide more context to auth about errors
on other pages.
 */
const MultiStageForm = ({children, pageSchema}: { children: React.ReactNode[], pageSchema?: string[][] }) => {
    const [progress, setProgress] = React.useState<number>(0);

    const form = useFormContext<z.infer<typeof formSchema>>();
    if (!form) {
        throw new Error("MultiStageForm must be used within a Form component.")
    }

    const {errors, isDirty, isValid, isSubmitting} = form.formState;
    const pagesWithErrors = pageSchema
        ?.map((page, pageIndex) => page.some(field => field in errors) ? pageIndex : -1)
        .filter(index => index !== -1);

    const errorPrior = pagesWithErrors?.some(index => index < progress);
    const errorNext = pagesWithErrors?.some(index => index > progress);

    return (
        <div className={"w-full h-full space-y-8"}>
            {children[progress]}
            <div className={"inline-flex w-full justify-between"}>
                {
                    progress > 0 &&
                    <Button className={`${errorPrior && 'outline outline-destructive'}`} type={"button"}
                            variant={"secondary"} onClick={() => setProgress((val) => val - 1)}>{"<"}-
                        Back</Button>
                }
                {
                    progress < children.length - 1 &&
                    <Button className={`${errorNext && 'outline outline-destructive'}`} type={"button"}
                            onClick={() => setProgress((val) => val + 1)}>Continue
                        -{">"}</Button>
                }
                {
                    progress === children.length - 1 &&
                    <Button disabled={!isValid} isLoading={isSubmitting} type={"submit"}
                            className={"w-32"}>Submit</Button>
                }
            </div>
        </div>
    )

}



