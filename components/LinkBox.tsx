import Link from "next/link";
import {cn} from "@/lib/utils";
import React from "react";
import {ArrowRight} from "lucide-react";

export default function LinkBox({title, description, href, className, ...props}: {
                                    title: string,
                                    description?: string,
                                    href: string
                                } & React.HTMLAttributes<HTMLDivElement>
) {
    return (
        <Link
            className={cn("group flex flex-col border rounded-md p-4 transition-all focus:outline-foreground hover:bg-accent", className)}
            href={href}>
            <div
                {...props}>
                <h3 className={"text-xl font-bold"}>
                    {title}
                </h3>
                <p className={"text-sm text-muted-foreground"}>
                    {description}
                </p>
                {props.children}
                <ArrowRight
                    className={"text-sm text-muted-foreground group-hover:mr-1 h-4 transition-all group-hover:text-foreground ml-auto w-fit"}
                />
            </div>
        </Link>
    )
}