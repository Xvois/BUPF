import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ServerErrorProps {
    children: ReactNode;
}

export const ServerError = React.forwardRef((props: ServerErrorProps & React.HTMLAttributes<HTMLDivElement>, ref) => {
    if(props.children) {
        return (
            <div {...props}
                 className={cn("inline-flex gap-4 items-center bg-destructive/10 border border-destructive/15 rounded-md p-4", props.className)}>
                <p className={"text-sm text-destructive/75"}>
                    {props.children}
                </p>
            </div>
        )
    }
})
