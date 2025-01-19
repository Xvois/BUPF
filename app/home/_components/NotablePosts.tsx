import {createClient} from "@/utils/supabase/server";
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
    const supabase = await createClient();
    const {data: modules} = await supabase.rpc("get_user_module_assignments");

    if (!modules) {
        return <></>
    }

    const {data: posts} = await supabase.from("posts").select("*, profiles (*)").in("target", modules.map(m => m.module_id)).limit(3);

    if (!posts) {
        return <></>
    }

    return (
        <div className={"w-full space-y-4"}>
            {
                posts.map(post => (
                    <Post key={post.id} post={post}/>
                ))
            }
        </div>
    )
}