import React from "react";
import {cn} from "@/utils/cn";
import {Info} from "lucide-react";

type InfoBoxProps = {
    title: string
} & React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>

const InfoBox = (props: InfoBoxProps) => {
    if (props.children) {
        return (
            <div {...props}
                 className={cn("grid gap-2 w-full items-center border bg-gradient-to-br from-background to-muted/25 rounded-md p-4", props.className)}>
                <p className={"inline-flex gap-2 items-center font-bold"}><Info className={"h-4 w-4"}/>{props.title}</p>
                <p className={"text-sm"}>
                    {props.children}
                </p>
            </div>
        )
    }
}

export default InfoBox;