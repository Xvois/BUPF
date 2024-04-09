import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ServerErrorProps {
    children: ReactNode;
}

export const ServerError = React.forwardRef((props: ServerErrorProps & React.HTMLAttributes<HTMLDivElement>) => {
    if(props.children) {
        return (
            <div {...props}
                 className={cn("inline-flex gap-4 items-center border border-destructive rounded-md p-4", props.className)}>
                <p className={"text-sm text-destructive"}>
                    {props.children}
                </p>
            </div>
        )
    }
})