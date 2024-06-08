'use client'

import {Tables} from "@/types/supabase";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import Post, {PostSkeleton} from "@/components/Post";
import {QueryFilters} from "@/types/api/options";


// Calculate the weight for a post
function calculateWeight(post: Tables<"posts">) {
    const now = Date.now();
    const postDate = new Date(post.created_at).getTime();
    const timeDifference = now - postDate; // in milliseconds
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // convert to days
    const commentsWeight = post.attached_comments.length;
    return commentsWeight - daysDifference; // adjust these values as needed
}

export function PostsList({queryFilters, type}: {
	queryFilters: QueryFilters,
    type: "modules" | "topics"
}) {

	const searchParams = new URLSearchParams();
	searchParams.set("filters", JSON.stringify(queryFilters));

    // Fetch posts data from the API using SWR
	let {data: response, error, isLoading} = useSWR(
		[`/api/posts` as const, {searchParams: searchParams.toString()}],
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