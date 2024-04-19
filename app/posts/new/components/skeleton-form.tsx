import {Skeleton} from "@/components/ui/skeleton";


export default function SkeletonForm() {
    return (
        <Skeleton className="w-full flex flex-col p-6 gap-4">
            <div className="grid gap-2">
                <Skeleton className="h-6 w-1/4 bg-background"/>
                <Skeleton className="h-6 w-3/4 bg-background"/>
            </div>
            <Skeleton className="h-6 w-1/4  bg-background"/>
            <Skeleton className="h-6 w-1/4  bg-background"/>
            <Skeleton className="h-6 w-1/4 bg-background"/>
        </Skeleton>
    )
}