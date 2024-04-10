'use client'

import {createClient} from "@/utils/supabase/client";
import React, {useEffect} from "react";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Button} from "@/components/ui/button";
import {User} from "@supabase/gotrue-js";
import LoadingSpinner from "@/components/LoadingSpinner";
import {PostgrestError} from "@supabase/supabase-js";
import {Separator} from "@/components/ui/separator";
import {redirect} from "next/navigation";
import {Server} from "lucide-react";
import {ServerError} from "@/components/ServerError";

const resendEmail = async (user: User, redirect: URL) => {
    const supabase = createClient();
    if (!user.email) {
        throw new Error("User email is not defined");
    }
    const {error} = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
            emailRedirectTo: redirect.toString()
        }
    });

    if (error) {
        throw error;
    }
}

function useFiveMinutesAgo() {
    const [fiveMinutesAgo, setFiveMinutesAgo] = React.useState(new Date(Date.now() - 5 * 60 * 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            setFiveMinutesAgo(new Date(Date.now() - 5 * 60 * 1000));
        }, 60 * 1000); // Update every minute

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    return fiveMinutesAgo;
};

export default function ConfirmPage() {
    const supabase = createClient();
    const {data, error} = useSWR<{ user: User }, PostgrestError>("/api/auth", fetcher);
    const user = data?.user;
    const [confirmed, setConfirmed] = React.useState(false);
    const [isResending, setIsResending] = React.useState(false);
    const [errorState, setErrorState] = React.useState<Error | null>(null);
    const [lastResend, setLastResend] = React.useState<Date | null>(null);
    const fiveMinutesAgo = useFiveMinutesAgo();

    const resend = async () => {
        if (!user) {
            return;
        }
        setIsResending(true);
        try {
            await resendEmail(user, new URL("/auth/callback", window.location.origin));
        } catch (e) {
            setErrorState(e);
        }
        setIsResending(false);

    }

    useEffect(() => {
        console.log(user);
        if (user?.confirmation_sent_at) {
            const lastResendDate = new Date(user.confirmation_sent_at);
            setLastResend(lastResendDate);
        }
        if (user?.confirmed_at) {
            setConfirmed(true);
        }
    }, [user]);

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "USER_UPDATED" && session?.user?.confirmed_at) {
            setConfirmed(true);
        }
    })

    useEffect(() => {
        redirect("/");
    }, [confirmed]);

    return (
        <div className={"p-6 w-full space-y-4"}>
            <div>
                <p className={"font-bold"}>BUPF</p>
                <h1 className={"text-4xl font-black"}>Confirm your email</h1>
            </div>
            <Separator />
            <div>
                <p className={"inline-flex items-center text-muted-foreground"}>
                    We have sent a confirmation email to {user ? user.email :
                    <LoadingSpinner className={"fill-muted-foreground h-4 w-40"}/>}. Please check your inbox and click
                    the
                    confirmation link to verify your email address.
                </p>
                <p className={"text-destructive"}>
                    For testers, the confirmation will come from sonnymparker9@gmail.com and <strong>likely go to spam</strong>.
                    I am working on this!
                </p>
                <p className={"text-muted-foreground"}>
                    If you haven't received the email, you can click the button below to resend it.
                </p>
            </div>
            <div className={"inline-flex flex-col gap-2"}>
                <Button disabled={lastResend ? (lastResend > fiveMinutesAgo) : false} onClick={resend}
                        isLoading={isResending} variant={"secondary"} className={"w-fit"}>Resend Email</Button>
                {
                    lastResend && lastResend > fiveMinutesAgo &&
                    <p className={"text-sm text-muted-foreground ml-1"}>
                        You can only resend the email every 5 minutes.
                    </p>
                }
            </div>
            <ServerError>
                {errorState?.message || error?.message}
            </ServerError>
        </div>
    )
}
