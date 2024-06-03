'use client'

import {useForm} from "react-hook-form";
import PasswordConfirmation from "@/components/form-components/password-confirmation";
import {formSchema} from "@/app/auth/reset/_schema/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {updatePassword} from "@/app/auth/reset/_actions/actions";


export default function ResetForm() {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    /*
        We may not pass a server action to the form component, but we can invoke
        one from the onSubmit function.
     */
    const onSubmit = (fd: z.infer<typeof formSchema>) => updatePassword(fd);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Reset password
                </CardTitle>
                <CardDescription>
                    Enter a new password
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form className={"p-6"} onSubmit={form.handleSubmit(onSubmit)}>
                    <PasswordConfirmation/>
                </form>
            </Form>
            <CardFooter>
                <Button type={"submit"}>Reset</Button>
            </CardFooter>
        </Card>

    )
}