'use client'

import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import Post, {PostSkeleton} from "@/components/Post";
import {wrapQParams, Filter} from "@/utils/api/helpers";

export function PostsList({queryFilters, type}: {
	queryFilters: Filter[],
    type: "modules" | "topics"
}) {


    const params = wrapQParams(queryFilters)

    // Fetch posts data from the API using SWR
	const {data: response, isLoading} = useSWR(
		[`/api/posts` as const, {searchParams: params.toString()}],
		([url, params]) => fetcher(url, params)
	);
	const posts = response?.data;

    if (isLoading) {
        return (
            <div className={"w-full overflow-y-scroll space-y-4"}>
                <PostSkeleton/>
                <PostSkeleton/>
                <PostSkeleton/>
                <PostSkeleton/>
                <PostSkeleton/>
            </div>
        );
    }

    return (
        <div className={"w-full overflow-y-scroll space-y-4"}>
            {
                posts && posts.length > 0 ?
                    posts.map(post => (
                        <Post type={type} post={post} key={post.id}/>
                    ))
                    :
                    <div className={"p-4 border rounded-md text-center"}>
                        <p>No posts available.</p>
                        <p className={"text-sm text-muted-foreground"}>Be the first to post!</p>
                    </div>
            }
        </div>
    )
}