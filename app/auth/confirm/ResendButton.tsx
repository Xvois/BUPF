"use client"
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";

/*
    * ResendButton
    * A button that resends the email to the user
    * It is disabled for 5 minutes after being clicked
    * It is disabled if the user has already clicked it
*/

type ConfirmButtonProps = {
    // Is a server action
    resendEmail: (email: string, redirect: string) => Promise<void>,
    email: string,
    domain: string
    sentAt: string
}

export default function ResendButton({resendEmail, email, domain}: ConfirmButtonProps) {


    const isBrowser = typeof window !== 'undefined';
    const localStorage = isBrowser ? window.localStorage : undefined;
    const [disabled, setDisabled] = useState(() => {
        const disableUntil = localStorage ? localStorage.getItem('disableUntil') : null;
        return disableUntil ? new Date().getTime() < Number(disableUntil) : false;
    });

    useEffect(() => {
        if (!localStorage) return;
        const disableUntil = localStorage.getItem('disableUntil');
        if (disableUntil && new Date().getTime() < Number(disableUntil)) {
            const timeoutId = setTimeout(() => {
                setDisabled(false);
                localStorage.removeItem('disableUntil');
            }, Number(disableUntil) - new Date().getTime());
            return () => clearTimeout(timeoutId);
        }
    }, []);

    const handleClick = async () => {
        if (!localStorage) return;
        setDisabled(true);
        const disableUntil = new Date().getTime() + 5 * 60 * 1000;
        localStorage.setItem('disableUntil', String(disableUntil));
        await resendEmail(email, `https://${domain}/auth/callback`);
        const timeoutId = setTimeout(() => {
            setDisabled(false);
            localStorage.removeItem('disableUntil');
        }, 5 * 60 * 1000);
        return () => clearTimeout(timeoutId);
    }

    return (
        <Button onClick={handleClick} disabled={disabled} variant={"secondary"}
            className={"w-fit"}>Resend Email</Button>
    )
}
