import {Skeleton} from "@/components/ui/skeleton";

export default function FormSkeleton() {
    return (
        <div className={"space-y-4"}>
            <div className={"space-y-2"}>
                <Skeleton className={"w-1/4 h-4"}/>
                <Skeleton className={"w-full h-6"}/>
                <Skeleton className={"w-1/2 h-4"}/>
            </div>
            <div className={"space-y-2"}>
                <Skeleton className={"w-1/4 h-4"}/>
                <Skeleton className={"w-full h-10"}/>
                <Skeleton className={"w-1/2 h-4"}/>
            </div>
            <div className={"space-y-2"}>
                <Skeleton className={"w-1/4 h-4"}/>
                <Skeleton className={"w-full h-6"}/>
                <Skeleton className={"w-1/2 h-4"}/>
            </div>
            <Skeleton className={"w-1/4 h-10"}/>
        </div>
    )
}