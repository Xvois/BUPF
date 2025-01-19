import {createClient} from "@/utils/supabase/server";
import Profile from "@/components/Profile";
import CommentSection from "@/components/Comments/CommentSection";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {Separator} from "@/components/ui/separator";
import {Component} from "lucide-react";
import Link from "next/link";
import {Tables} from "@/types/supabase";
import {DeleteButton} from "@/app/modules/[module_id]/posts/[post_id]/_components/DeleteButton";


// Fetch Post Data
async function fetchPostData(postId: string) {
    const supabase = await createClient();

    // Fetch the post and profile (single query using join)
    const {data: post} = await supabase
        .from("posts")
        .select("*, profiles(*)")
        .eq("id", Number(postId))
        .single();

    // Fetch user data
    const {
        data: {user},
    } = await supabase.auth.getUser();

    const isOwner = user?.id === post?.owner;

    return {post, isOwner, user};
}

// Post Header Component
const PostHeader = ({
                        post,
                    }: {
    post: Tables<"posts"> & {
        profiles: Tables<"profiles"> | null;
    };
}) => (
    <header
        className="flex flex-col gap-2 h-full w-full select-none justify-end rounded-md no-underline outline-none break-words overflow-hidden">
        <Link
            href={`/modules/${post.target}`}
            className={"inline-flex gap-1 text-sm text-muted-foreground hover:underline"}
        >
            <Component className="h-4 w-4"/>
            <span>{post.target}</span>
        </Link>
        <h1 className={"font-black text-4xl"}>
            {post.heading}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
				({new Date(post.created_at).toDateString()})
			</span>
        </h1>
        <p className={"text-sm"}>
            By{" "}
            {!post.anonymous && post.profiles ? (
                <Profile profile={post.profiles}/>
            ) : (
                <span className="font-medium text-muted-foreground">Anonymous</span>
            )}
        </p>
    </header>
);

// Post Content Component
const PostContent = ({post}: {     post: Tables<"posts"> & {
        profiles: Tables<"profiles"> | null;
    }; }) => (
    <MarkdownRender>{post.content}</MarkdownRender>
);

// Main Post Page Component
// @ts-expect-error Unknown types for dynamic APIs in NEXT 15
export default async function PostPage({params}) {
    // See https://nextjs.org/docs/messages/sync-dynamic-apis
    const {post_id} = await params;
    const {post, isOwner} = await fetchPostData(post_id);

    if (!post) {
        return <p>Post not found</p>; // Fallback for non-existent post
    }

    return (
        <article className={"space-y-4 md:gap-6 lg:w-2/3 lg:mx-auto"}>
            <div className={"inline-flex flex-col p-8 gap-2"}>
                <PostHeader post={post}/>
                <PostContent post={post}/>
            </div>
            {
                isOwner && (
                    <>
                        <Separator/>
                        <div className={"px-8"}>
                            <DeleteButton post_id={Number(post_id)}/>
                        </div>
                    </>
                )
            }
            <Separator/>
            <CommentSection
                className={"p-6"}
                marked_comment={post.marked_comment || undefined}
                post_type={post.type}
                post_id={post_id}
                owner={post.owner}
            />
        </article>
    );
}