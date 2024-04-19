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
            <div className={"grid grid-cols-3 gap-4"}>
                <LinkBoxSkeleton/>
                <LinkBoxSkeleton/>
                <LinkBoxSkeleton/>
                <LinkBoxSkeleton/>
                <LinkBoxSkeleton/>
            </div>
        </section>
    )
}