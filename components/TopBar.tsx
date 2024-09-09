import * as React from "react"
import {Suspense} from "react"
import {createClient} from "@/utils/supabase/server";
import NavMenu from "@/components/NavMenu/NavMenu";
import UserDropdown from "@/components/UserDropdown";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {redirect} from "next/navigation";

const wrapperClass = "sticky top-0 left-0 h-16 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm" +
    " bg-background/50 border-b border-border inline-flex w-full flex-row items-center align-middle justify-between" +
    " gap-x-10 px-4" +
    " py-2 z-50 mb-4 shadow-sm"


export default function TopBar() {
    return (
        <Suspense fallback={<TopBarSkeleton/>}>
            <LoadedBar/>
        </Suspense>
    )
}


async function LoadedBar() {

    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) {
        redirect("/login");
    }

    const {data: modules} = await supabase.rpc("get_user_module_assignments");
    const {data: topics} = await supabase.from("topics").select("*");

    if (user) {
        return (
            <div
                className={wrapperClass}>
                <NavMenu modules={modules} topics={topics}/>
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
                <Skeleton className={"h-8 w-24"}/>
            </div>
            <Skeleton className={"h-8 w-24"}/>
        </div>
    )
}