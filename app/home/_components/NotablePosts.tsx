import {createClient} from "@/utils/supabase/server";
import apiAxios from "@/utils/axios/apiAxios";
import {wrapQParams} from "@/utils/api/helpers";
import {Suspense} from "react";
import Post, {PostSkeleton} from "@/components/Post";


export default function NotablePosts() {
    return (
        <Suspense fallback={<NotablePostsSkeleton />}>
            <NotablePostsFilled/>
        </Suspense>
    )
}

function NotablePostsSkeleton() {
    return (
        <div className={"w-full space-y-4"}>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
        </div>
    )
}

async function NotablePostsFilled() {
    const supabase = createClient();
    const {data: modules} = await supabase.rpc("get_user_module_assignments");

    if (!modules) {
        return <></>
    }

    const params = wrapQParams([
        {
            column: "target",
            operator: "in",
            value: modules.map(m => m.module_id)
        },
    ], undefined, 3);
    const {data: {data: posts}} = await apiAxios.get(`/api/posts`, {searchParams: params.toString()});

    if (!posts) {
        return <></>
    }

    return (
        <div className={"w-full space-y-4"}>
            {
                posts.map(post => (
                    <Post key={post.id} post={post} type={"modules"}/>
                ))
            }
        </div>
    )
}