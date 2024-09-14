"use client"

import {createClient} from "@/utils/supabase/client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const CTAButton = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const supabase = createClient();

    supabase.auth.getUser().then(({data: user}) => {
        if (user) {
            setIsLoggedIn(true);
        }
    })

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