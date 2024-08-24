'use client'

import {Button} from "@/components/ui/button";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import login from "@/app/login/_actions/login";
import {FormEvent, Suspense, useState} from "react";

/*
    * LoginForm
    * A form for logging in to the application
    * @return: A form for logging in to the application
*/
export default function LoginForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContents/>
        </Suspense>
    )
}


function LoginContents() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;
        setIsLoading(true)
        await login({email, password});
        setIsLoading(false)
    }

    return (
        <form onSubmit={onSubmit} className={"flex flex-col items-end space-y-8"}>
            <div className={"w-full space-y-2"}>
                <label htmlFor="email"
                       className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}>Email</label>
                <input id="email"
                       className={"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                       name={"email"}
                       type={"email"}></input>
            </div>
            <div className={"w-full space-y-2"}>
                <label htmlFor="password"
                       className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}>Password</label>
                <input id="password"
                       className={"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
                       name={"password"}
                       type={"password"}></input>
            </div>
			<Button isLoading={isLoading} type={"submit"} className={"w-full"}>Login</Button>
            <ServerError className={"w-full"}>
                {searchParams.get("error")}
            </ServerError>
        </form>
    )
}
