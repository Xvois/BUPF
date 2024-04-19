import {createClient} from "@/utils/supabase/client";
import {Separator} from "@/components/ui/separator";
import {headers} from "next/headers";
import ResendButton from "@/app/auth/confirm/ResendButton";
import AuthWatcher from "@/components/AuthWatcher";
import {redirect} from "next/navigation";

/*
    * ConfirmPage
    * This page is responsible for confirming the user's email address.
    * It will display a message to the user to check their email inbox for a confirmation email.
    * If the user hasn't received the email, they can click the resend button to resend the email.
    * The user can only resend the email every 5 minutes.
*/

type ExpectedParams = {
    email?: string,
    sent_at?: string

}

export default function ConfirmPage({params, searchParams}: { params: {}, searchParams: ExpectedParams }) {
    const headersList = headers();
    const domain = headersList.get("host") || ""
    const email = searchParams.email;
    const sentAt = searchParams.sent_at;

    if (!email || !sentAt) {
        return <div>Invalid request</div>
    }

    const resendEmail = async (email: string, redirect: string) => {
        "use server"
        const supabase = createClient();
        const {error} = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: redirect
            }
        });

        if (error) {
            throw error;
        }
    }

    const onSignedIn = async () => {
        "use server"
        return redirect("/")
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
                <ResendButton resendEmail={resendEmail} email={email} domain={domain} sentAt={sentAt} />
                <p className={"text-sm text-muted-foreground"}>
                    You can only resend the email every 5 minutes.
                </p>
            </div>
            {/* AuthWatcher will watch for the user to sign in and redirect them to the home page */}
            <AuthWatcher onSignedIn={onSignedIn} />
        </div>
    )
}
