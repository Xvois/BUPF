import {createClient} from "@/utils/supabase/server";
import Comment from "@/components/Comments/Comment";
import CommentForm from "@/components/Comments/comment-form";
import {Tables} from "@/types/supabase";
import {cn} from "@/lib/utils";
import {ServerError} from "@/components/ServerError";
import {HTMLAttributes} from "react";

export type Comment = Tables<"comments"> & {
    profiles: Tables<"profiles"> & {
        courses: Tables<"courses"> | null
    } | null
} & { children: Comment[] }

type CommentWOChildren = Omit<Comment, "children">;

type CommentSectionProps = {
    post_id: string,
    post_type: "question" | "discussion" | "article",
    marked_comment?: number
    owner: string | null
}

function organizeComments(comments: CommentWOChildren[]): Comment[] {
    const commentsMap: { [key: number]: Comment } = {};

    comments.forEach(comment => {
        commentsMap[comment.id] = {...comment, children: []};
    });

    comments.forEach(comment => {
        if (comment.parent && commentsMap[comment.parent]) {
            commentsMap[comment.parent].children.push(commentsMap[comment.id]);
        }
    });

    return Object.values(commentsMap).filter(comment => !comment.parent);
}

export default async function CommentSection(props: CommentSectionProps & HTMLAttributes<HTMLDivElement>) {
    const supabase = createClient();
    const {data: {user: user}, error: userError} = await supabase.auth.getUser();
    const {
        data: postComments,
        error: postCommentsError
    } = await supabase.from("posts").select("attached_comments").eq("id", props.post_id).single();

    if (!user) {
        return (
            <ServerError>
                {userError?.message}
            </ServerError>
        )
    }

    if (!postComments) {
        return (
            <ServerError>
                {postCommentsError?.message}
            </ServerError>
        )
    }

    const {
        data: comments,
        error: commentsError
    } = await supabase.from("comments").select("*, profiles (*, courses (*))").in("id", postComments.attached_comments);

    if (!comments) {
        return (
            <ServerError>
                {commentsError?.message}
            </ServerError>
        )
    }

    const resolvedComments = organizeComments(comments);

    return (
        <section className={cn("space-y-8", props.className)}>
            <CommentForm postID={+props.post_id}/>
            <div className={"space-y-4"}>
                {resolvedComments.map(comment => (
                    <Comment
                        isDeletable={user ? user.id === comment.owner : false}
                        isReportable={(user && user.id !== comment.owner)}
                        isMarkable={(props.post_type === "question" && user && user.id === props.owner)}
                        isMarked={comment.id === props.marked_comment}
                        postID={props.post_id}
                        key={comment.id}
                        comment={comment}
                        user={user}
                    />
                ))}
            </div>
        </section>
    )
}
