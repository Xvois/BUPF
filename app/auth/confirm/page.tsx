'use client'
import {Separator} from "@/components/ui/separator";
import ResendButton from "@/app/auth/confirm/ResendButton";
import {redirect, useSearchParams} from "next/navigation";
import {useAuthWatcher} from "@/hooks/use-auth-watcher";

/*
    * ConfirmPage
    * This page is responsible for confirming the user's email address.
    * It will display a message to the user to check their email inbox for a confirmation email.
    * If the user hasn't received the email, they can click the resend button to resend the email.
    * The user can only resend the email every 5 minutes.
*/


export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const sentAt = searchParams.get('sent_at');

    useAuthWatcher({
        onSignedIn: () => {
            redirect("/home");
        }
    })

    if (!email || !sentAt) {
        return <div>Invalid request</div>
    }


    return (
        <div className={"p-6 w-full space-y-4"}>
            <div>
                <p className={"font-bold"}>BUPF</p>
                <h1 className={"text-4xl font-black"}>Confirm your email</h1>
            </div>
            <Separator/>
            <div>
                <p className={"inline-flex items-center text-muted-foreground"}>
                    We have sent a confirmation email to {email}. Please check your inbox and click
                    the
                    confirmation link to verify your email address.
                </p>
                <p className={"text-muted-foreground"}>
                    If you haven't received the email, you can click the button below to resend it.
                </p>
            </div>
            <div className={"inline-flex flex-col gap-2"}>
                <ResendButton email={email}/>
                <p className={"text-sm text-muted-foreground"}>
                    You can only resend the email every 5 minutes.
                </p>
            </div>
        </div>
    )
}
