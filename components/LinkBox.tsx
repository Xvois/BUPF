import Link from "next/link";
import {cn} from "@/lib/utils";
import React from "react";
import {ArrowRight} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

export default function LinkBox({title, description, href, className, ...props}: {
                                    title: string,
                                    description?: string,
    href: string,
    disabled?: boolean
                                } & React.HTMLAttributes<HTMLDivElement>
) {
    return (
        <Link
            className={
                cn(cn("group flex flex-col border rounded-md p-4 transition-all focus:outline-foreground hover:bg-accent", className), `${props.disabled && "cursor-not-allowed opacity-50 pointer-events-none "}`)
            }
            href={href}
            aria-disabled={props.disabled}
        >
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
                    className={"text-sm text-muted-foreground group-hover:mr-1 h-4 mt-1 transition-all group-hover:text-foreground ml-auto w-fit"}
                />
            </div>
        </Link>
    )
}

export const LinkBoxSkeleton = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <Skeleton
            {...props}
            className={cn("flex flex-col border rounded-md p-4 transition-all focus:outline-foreground hover:bg-accent", className)}>
            <Skeleton className={"space-y-4"}>
                <h3 className={"text-xl font-bold"}>
                    <Skeleton className={"w-1/2 bg-background h-6 rounded-md"}/>
                </h3>
                <p className={"text-sm text-muted-foreground"}>
                    <Skeleton className={"w-1/3 bg-background h-4 rounded-md"}/>
                </p>
                <ArrowRight
                    className={"text-sm text-muted-foreground h-4 ml-auto w-fit"}
                />
            </Skeleton>
        </Skeleton>
    )
}