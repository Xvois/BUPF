import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {SendHorizonal} from "lucide-react";
import {changePassword} from "@/app/forgot/actions";
import {ServerError} from "@/components/ServerError";


export default async function Forgot({
                                         params,
                                         searchParams,
                                     }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Forgot password
                    </CardTitle>
                    <CardDescription>
                        Enter your email address to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <form className={"grid space-y-2 p-6"} action={changePassword}>
                    <Label htmlFor="email">Email</Label>
                    <div className={"inline-flex space-x-4"}>
                        <Input type="email" id="email" name="email" required/>
                        <Button type="submit" size={"sm"} className={"h-full"}>
                            <SendHorizonal className={"h-6 w-6"}/>
                        </Button>
                    </div>
                </form>
                <CardFooter>
                    <Link className={"text-sm text-muted-foreground underline"} href="/login">Back to login</Link>
                </CardFooter>
            </Card>
            <ServerError>
                {searchParams?.error}
            </ServerError>
        </>

    )
}