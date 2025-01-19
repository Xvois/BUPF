import {CircleCheck, CircleHelp} from "lucide-react";
import {createClient} from "@/utils/supabase/server";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";


export default async function PostsIndicator({moduleID}: { moduleID: string }) {
    return (
        <Suspense fallback={<EmptyPostsIndicator />}>
            <FilledPostsIndicator moduleID={moduleID} />
        </Suspense>
    )
}

const FilledPostsIndicator = async ({moduleID}: { moduleID: string }) => {
    const supabase = await createClient();
    const {data: posts, error} = await supabase.from("posts").select("*").eq("target", moduleID);

    if(error) {
        return (
            <></>
        )
    }

    const completed = posts.filter(post => !!post.marked_comment).length;
    const incomplete = posts.length - completed;

    return (
        <>
            <div className={"flex flex-row items-center"}>
                <p className={"w-2.5 text-sm text-red-500/75"}>{incomplete}</p>
                <CircleHelp className={"text-red-500/75 h-4"}/>
            </div>
            <div className={"flex flex-row items-center"}>
                <p className={"w-2.5 text-sm text-green-600/90"}>{completed}</p>
                <CircleCheck className={"text-green-600/90 h-4"}/>
            </div>
        </>
    )
}

const EmptyPostsIndicator = () => {
    return (
        <>
            <div className={"flex flex-row items-center"}>
                <Skeleton className={"h-2.5 w-2.5"} />
                <CircleHelp className={"text-red-500/75 h-4"}/>
            </div>
            <div className={"flex flex-row items-center"}>
                <Skeleton className={"h-2.5 w-2.5"} />
                <CircleCheck className={"text-green-600/90 h-4"}/>
            </div>
        </>
    )
}