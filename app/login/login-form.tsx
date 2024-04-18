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
import {useSearchParams} from "next/navigation";


export default function LoginForm(props: { signIn: (fd: z.infer<typeof formSchema>) => Promise<void> }) {

    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const {isValid, isSubmitting} = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        /*
        This pattern is so stupid: react-hook-form wants to invoke
        a client function and onSubmit must be used for validation.
        This leads to this mess where a server action is invoked
        through this function.
         */
        await props.signIn(values);
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
                <Button isLoading={isSubmitting} disabled={!isValid} className={"w-32"}
                        type={"submit"}>Login</Button>
                <Link className={"underline text-sm text-muted-foreground"} href={"/forgot"}>Forgotten
                    password</Link>
                <ServerError className={"w-full"}>
                    {searchParams.get("error")}
                </ServerError>
            </form>
        </Form>
    )
}