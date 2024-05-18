"use client"
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {resendEmail} from "./resend";

/*
    * ResendButton
    * A button that resends the email to the user
    * It is disabled for 5 minutes after being clicked
    * It is disabled if the user has already clicked it
*/

type ConfirmButtonProps = {
    email: string,
}

export default function ResendButton({email}: ConfirmButtonProps) {
    const isBrowser = typeof window !== 'undefined';
    const localStorage = isBrowser ? window.localStorage : undefined;
    const [disabled, setDisabled] = useState(() => {
        const disableResendUntil = localStorage ? localStorage.getItem('disableResendUntil') : null;
        return disableResendUntil ? new Date().getTime() < Number(disableResendUntil) : false;
    });

    useEffect(() => {
        if (!localStorage) return;
        const disableResendUntil = localStorage.getItem('disableResendUntil');
        if (disableResendUntil && new Date().getTime() < Number(disableResendUntil)) {
            const timeoutId = setTimeout(() => {
                setDisabled(false);
                localStorage.removeItem('disableResendUntil');
            }, Number(disableResendUntil) - new Date().getTime());
            return () => clearTimeout(timeoutId);
        }
    }, []);

    const handleClick = async () => {
        if (!localStorage) return;
        setDisabled(true);
        const disableResendUntil = new Date().getTime() + 5 * 60 * 1000;
        localStorage.setItem('disableResendUntil', String(disableResendUntil));
        const domain = window.location.hostname;
        await resendEmail(email, `https://${domain}/auth/callback`);
        const timeoutId = setTimeout(() => {
            setDisabled(false);
            localStorage.removeItem('disableResendUntil');
        }, 5 * 60 * 1000);
        return () => clearTimeout(timeoutId);
    }

    return (
        <Button onClick={handleClick} disabled={disabled} variant={"secondary"}
            className={"w-fit"}>Resend Email</Button>
    )
}
