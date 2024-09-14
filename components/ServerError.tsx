import React from "react";
import {cn} from "@/utils/cn";
import {CircleAlert} from "lucide-react";

/**
 * A box that displays a server error message with an icon.
 */
export const ServerError = (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>) => {
    if(props.children) {
        return (
            <div {...props}
                 className={cn("grid gap-2 w-full items-center border border-destructive/10 bg-gradient-to-br" +
                     " from-background" +
                     " to-red-500/10 rounded-md p-4", props.className)}>
                <p className={"inline-flex gap-2 items-center font-bold text-destructive"}><CircleAlert
                    className={"h-4 w-4"}/>Server error</p>
                <p className={"text-sm text-destructive/75"}>
                    {props.children}
                </p>
            </div>
        )
    }
}
