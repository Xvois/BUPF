"use client"

import * as React from "react"
import {createClient} from "@/utils/supabase/client";
import NavMenu from "@/components/NavMenu/NavMenu";
import UserDropdown from "@/components/UserDropdown";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {useEffect} from "react";
import {User} from "@supabase/auth-js";
import {Database} from "@/types/supabase";

const wrapperClass = "sticky top-0 left-0 h-16 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm" +
    " bg-background/50 border-b border-border inline-flex w-full flex-row items-center align-middle justify-between" +
    " gap-x-10 px-4" +
    " py-2 z-50 mb-4 shadow-sm"


export default function TopBar() {

    const supabase = createClient()

    type RPCReturn = Database["public"]["Functions"]["get_user_module_assignments"]["Returns"];


    const [user, setUser] = React.useState<User | null>(null)
    const [modules, setModules] = React.useState<RPCReturn | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({data: {user}}) => setUser(user));
        supabase.rpc("get_user_module_assignments").then(({data: modules}) => setModules(modules));
    }, []);


    if (user) {
        return (
            <div
                className={wrapperClass}>
                <NavMenu modules={modules}/>
                <UserDropdown/>
            </div>
        )
    } else {
        return (
            <div className={wrapperClass}>
                <Button className={"ml-auto"} size={"sm"} variant={"outline"} asChild>
                    <Link href={"/login"}>
                        Login
                    </Link>
                </Button>
            </div>
        )
    }
}

export const TopBarSkeleton = () => {
    return (
        <div className={wrapperClass}>
            <div className={"flex flex-row gap-4"}>
                <Skeleton className={"h-8 w-24"}/>
                <Skeleton className={"h-8 w-24"}/>
            </div>
            <Skeleton className={"h-8 w-24"}/>
        </div>
    )
}