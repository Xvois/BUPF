import {Button} from "@/components/ui/button";
import LoginForm from "@/app/login/login-form";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CircleHelp} from "lucide-react";

export const dynamic = "force-static";

export default function Login() {

    return (
        <div className={"space-y-4 my-auto"}>
            <Card
                className="w-full rounded-xl space-y-8 p-6 bg-popover mx-auto sm:my-auto">
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
            <Button variant={"secondary"} className={"w-full"} asChild>
                <a href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}
                   className={"inline-flex space-x-1 items-center justify-center"}>
                    <p>I need help</p>
                    <CircleHelp className={"h-4 w-4"}/>
                </a>
            </Button>
        </div>
    );
}
