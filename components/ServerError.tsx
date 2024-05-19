import React, {ReactNode} from "react";
import {cn} from "@/utils/cn";
import {CircleAlert} from "lucide-react";

interface ServerErrorProps {
    children: ReactNode;
}

export const ServerError = React.forwardRef((props: ServerErrorProps & React.HTMLAttributes<HTMLDivElement>, ref) => {
    if(props.children) {
        return (
            <div {...props}
                 className={cn("grid gap-4 w-full items-center border bg-gradient-to-br" +
                     " from-background" +
                     " to-red-500/10 rounded-md p-4", props.className)}>
                <p className={"inline-flex gap-1 items-center font-bold text-destructive"}><CircleAlert
                    className={"h-4 w-4"}/>Server error</p>
                <p className={"text-sm text-destructive/75"}>
                    {props.children}
                </p>
            </div>
        )
    }
})
