/*
 Emphasise something within a subtle text
 */
import React from "react";

const EmSubtle = (props: { children: React.ReactNode }) => {
    return (
        <span className={"text-foreground text-sm"}>{props.children}</span>
    )
}

export default EmSubtle;