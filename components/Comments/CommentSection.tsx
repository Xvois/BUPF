import {createClient} from "@/utils/supabase/server";
import Comment from "@/components/Comments/Comment";
import CommentForm from "@/components/Comments/comment-form";
import {Tables} from "@/types/supabase";
import {PostgrestError} from "@supabase/supabase-js";

export type Comment = Tables<"comments"> & { profiles: Tables<"profiles"> | null } & { children: Comment[] }

// Helper function to create a Supabase client and fetch children
async function fetchChildren(tl_comments: (Tables<"comments"> & { profiles: Tables<"profiles"> | null })[]) {
    const supabase = createClient();
    return supabase
        .from("comment_children")
        .select("id, children")
        .in("id", tl_comments.map(comment => +comment.id));
}

// Helper function to fetch children comments
async function fetchChildrenComments(idSet: Set<number[]>) {
    const supabase = createClient();
    const ids = Array.from(idSet).flat();
    return supabase
        .from("comments")
        .select("*, profiles (*)")
        .in("id", ids);
}

// Main recursive function to solve children
async function recursiveChildSolver(tl_comments: (Tables<"comments"> & {
    profiles: Tables<"profiles"> | null
})[], depth=0): Promise<{ data: Comment[] | null, error: PostgrestError | null }> {

    if(depth > 10) {
        return {data: null, error: null};
    }

    const { data: children, error: childrenError } = await fetchChildren(tl_comments);

    if (!children) {
        return { data: null, error: childrenError };
    }

    if (children.length === 0) {
        const updatedComments = tl_comments.map(comment => ({ ...comment, children: [] }));
        return { data: updatedComments, error: null };
    }

    const idSet = new Set(children.map(child => child.children));
    const idMap = new Map(children.map(child => [child.id, child.children]));

    const { data: childrenComments, error: commentsError } = await fetchChildrenComments(idSet);

    if (!childrenComments) {
        return { data: null, error: commentsError };
    }

    const { data: resolvedChildren, error: resolvedError } = await recursiveChildSolver(childrenComments, depth+1);

    if (resolvedError || !resolvedChildren) {
        return { data: null, error: resolvedError };
    }

    const resolvedChildrenMap = new Map(resolvedChildren.map(child => [child.id, child]));

    const resolvedComments = tl_comments.map(comment => {
        const children = idMap.get(comment.id);

        if (!children) {
            return { ...comment, children: [] };
        }

        const resolvedChildren = children.map(id => resolvedChildrenMap.get(id));

        // Type assertion as TS does not define it as Comment[] after filtering (even though it is)
        return { ...comment, children: resolvedChildren.filter(child => !!child) as Comment[] };
    });

    return { data: resolvedComments, error: null };
}

export default async function CommentSection(props: {
    post_id: string,
    post_type: "question" | "discussion" | "article",
    marked_comment?: number
}) {
    const supabase = createClient();
    const {data: {user: user}} = await supabase.auth.getUser();
    const {data: result} = await supabase.from("posts").select("tl_comments").eq("id", props.post_id).single();

    if(!user) {
        return Response.json({error: "User not found"}, {status: 404});
    }

    if (!result) {
        return Response.json({error: "Post not found"}, {status: 404})
    }
    const {data: comments} = await supabase.from("comments").select("*, profiles (*)").in("id", result.tl_comments);

    if(!comments) {
        return Response.json({error: "Error fetching comments"}, {status: 404});
    }

    const {data: resolvedComments, error: resolvingError} = await recursiveChildSolver(structuredClone(comments));

    if(!resolvedComments || resolvingError) {
        return Response.json({error: "Error resolving comments"}, {status: 500});
    }

    // Sort comments so that the marked comment is always first
    resolvedComments.sort((a, b) => {
        if (a.id === props.marked_comment) return -1;
        if (b.id === props.marked_comment) return 1;
        return 0;
    });


    return (
        <div>
            {user && <CommentForm postID={+props.post_id}/>}
            <div className={"space-y-4"}>
                {resolvedComments && resolvedComments.map(comment => (
                    <Comment
                        isDeletable={user ? user.id === comment.owner : false}
                        isReportable={!!(user && user.id !== comment.owner)}
                        isMarkable={!!(props.post_type === "question" && user && user.id === comment.owner)}
                        isMarked={comment.id === props.marked_comment}
                        postID={props.post_id}
                        key={comment.id}
                        comment={comment}
                        user={user}
                    />
                ))}
            </div>
        </div>
    )
}