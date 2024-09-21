"use client"

import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const CTAButton = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            if (data.session?.access_token) {
                setIsLoggedIn(true);
            }
        }).catch(() => {
            setIsLoggedIn(false);
        })
    }, [])


    if (isLoggedIn) {
        return (
            <Button className={"mt-4"} size={"lg"} variant={"secondary"} asChild>
                <Link href={"/home"}>
                    Head to home
                </Link>
            </Button>
        )
    }
    return (
        <Button className={"mt-4"} size={"lg"} variant={"default"} asChild>
            <Link href={"/signup"}>
                Join now
            </Link>
        </Button>
    )
}