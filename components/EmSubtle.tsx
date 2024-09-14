
import React from "react";
import {cn} from "@/utils/cn";

/*
 Emphasise something within a subtle text
 */
const EmSubtle = (props: { children: React.ReactNode, className?: string }) => {
    return (
        <span className={cn("text-foreground text-sm", props.className)}>{props.children}</span>
    )
}

export default EmSubtle;