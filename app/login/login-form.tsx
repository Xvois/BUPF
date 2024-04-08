'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {formSchema} from "@/app/login/formSchema";
import React from "react";
import {ServerError} from "@/components/ServerError";
import Link from "next/link";


export default function LoginForm(props: { signIn: (fd: z.infer<typeof formSchema>) => Promise<void> }) {

    const [loginError, setLoginError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const {isDirty, isValid, isSubmitting} = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        /*
        This pattern is so stupid: react-hook-form wants to invoke
        a client function and onSubmit must be used for validation.
        This leads to this mess where a server action is invoked
        through this function.
         */
        try {
            await props.signIn(values);
        } catch (e) {
            const error = e as Error;
            setLoginError(error.message);
        }
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col items-end space-y-8"}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Bath Email</FormLabel>
                            <FormControl>
                                <Input type={"email"} {...field} />
                            </FormControl>
                            <FormDescription>Your university assigned email address.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button disabled={!isDirty || !isValid || isSubmitting} className={"w-32"}
                        type={"submit"}>Login</Button>
                <Link className={"underline text-sm text-muted-foreground"} href={"/forgot"}>Forgotten
                    password</Link>
                <ServerError className={"w-full"}>
                    {loginError}
                </ServerError>
            </form>
        </Form>
    )
}