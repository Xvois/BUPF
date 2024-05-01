'use client'

import React, {ReactElement} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";


export const Return = (): ReactElement<"button"> => {
    const excludedPaths = ["/login", "/signup", "/"];
    const router = useRouter()
    const path = usePathname();

    if (excludedPaths.includes(path)) return <></>;

    return (
        <Button variant={"link"} className={"group inline-flex gap-1 w-fit pl-0"} onClick={() => router.back()}>
            <ArrowLeft
                className={"text-sm h-4 transition-all ml-auto w-fit"}
            /> Return
        </Button>
    )
}