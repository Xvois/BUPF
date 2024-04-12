"use client"
import {Button} from "@/components/ui/button";
import React from "react";

type ConfirmButtonProps = {
    // Is a server action
    resendEmail: (email: string, redirect: string) => Promise<void>,
    email: string,
    domain: string
    sentAt: string
}

export default function ResendButton({ resendEmail, email, domain, sentAt }: ConfirmButtonProps) {


    const isBrowser = typeof window !== 'undefined';
    const localStorage = isBrowser ? window.localStorage : undefined;
    const [disabled, setDisabled] = React.useState(() => {
        const disableUntil = localStorage ? localStorage.getItem('disableUntil') : null;
        return disableUntil ? new Date().getTime() < Number(disableUntil) : false;
    });
    React.useEffect(() => {
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