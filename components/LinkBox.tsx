import Link from "next/link";
import {cn} from "@/lib/utils";
import React from "react";

export default function LinkBox({title, description, href, className, ...props}: {
                                    title: string,
                                    description?: string,
                                    href: string
                                } & React.HTMLAttributes<HTMLDivElement>
) {
    return (
        <Link className={cn("group flex flex-col border rounded-md p-4 transition-all focus:outline-foreground", className)} href={href}>
            <div
                 {...props}>
                <h3 className={"text-xl font-bold"}>
                    {title}
                </h3>
                <p className={"text-sm text-muted-foreground"}>
                    {description}
                </p>
                {props.children}
                <p className={"text-sm text-muted-foreground group-hover:mr-1 transition-all group-hover:text-foreground ml-auto w-fit"}>-{">"}</p>
            </div>
        </Link>
    )
}