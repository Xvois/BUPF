import {Button} from "@/components/ui/button";
import LoginForm from "@/app/login/login-form";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {CircleHelp} from "lucide-react";
import DynamicIconGrid from "@/components/DynamicIconGrid/DynamicIconGrid";

export default function Login() {

    return (
        <div className={"flex flex-row w-screen h-svh"}>
            <div className={"w-2/3 h-full opacity-15 z-[-1]"}>
                <DynamicIconGrid allowEngagement={false}/>
            </div>
            <div className={"space-y-4 my-auto w-1/3 h-full bg-popover border-l p-8 "}>
                <h1>BUPF</h1>
                <p>
                    The Bath University Physics Forum
                </p>
                <Separator/>
                <LoginForm/>
                <Separator/>
                <p className={"text-center"}>Don't have an account?</p>
                <Link className={"underline"} href={"/signup"}>
                    Sign up
                </Link>
                <Button variant={"secondary"} className={"w-full"} asChild>
                    <a href={"mailto:smp90@bath.ac.uk?subject=BUPF%20Help"}
                       className={"inline-flex space-x-1 items-center justify-center"}>
                        <p>I need help</p>
                        <CircleHelp className={"h-4 w-4"}/>
                    </a>
                </Button>
            </div>
        </div>

    )
        ;
}
