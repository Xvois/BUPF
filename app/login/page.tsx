export const dynamic = "force-static";

import LoginForm from "@/app/login/login-form";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function Login() {

    return (
        <Card
            className="w-full max-w-96 rounded-xl space-y-8 p-6 bg-popover mx-auto sm:my-auto">
            <CardHeader className={"p-0"}>
                <CardTitle>BUPF</CardTitle>
                <CardDescription>
                    The Bath University Physics Forum
                </CardDescription>
            </CardHeader>
            <Separator/>
            <LoginForm/>
            <Separator/>
            <CardFooter className={"inline-flex gap-2 text-sm text-muted-foreground"}>
                <p className={"text-center"}>Don't have an account?</p>
                <Link className={"underline"} href={"/signup"}>
                    Sign up
                </Link>
            </CardFooter>
        </Card>
    );
}
