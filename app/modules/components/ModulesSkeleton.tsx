import React from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";
import {LinkBoxSkeleton} from "@/components/LinkBox";

export const ModulesSkeleton = () => {
    return (
        <section className={"space-y-4 p-6"}>
            <Skeleton className={"w-1/4 h-6 rounded-md"}/>
            <Skeleton className={"w-1/3 h-4 rounded-md"}/>
            <Separator/>
            <div className={"flex flex-row flex-wrap gap-4"}>
                <LinkBoxSkeleton className={"min-w-full sm:min-w-72 flex-grow"}/>
                <LinkBoxSkeleton className={"min-w-full sm:min-w-72 flex-grow"}/>
                <LinkBoxSkeleton className={"min-w-full sm:min-w-72 flex-grow"}/>
                <LinkBoxSkeleton className={"min-w-full sm:min-w-72 flex-grow"}/>
                <LinkBoxSkeleton className={"min-w-full sm:min-w-72 flex-grow"}/>
            </div>
        </section>
    )
}