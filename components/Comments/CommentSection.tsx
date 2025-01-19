import {createClient} from "@/utils/supabase/server";
import Comment from "@/components/Comments/Comment";
import CommentForm from "@/components/Comments/comment-form";
import {Tables} from "@/types/supabase";
import {cn} from "@/utils/cn";
import {ServerError} from "@/components/ServerError";
import {HTMLAttributes} from "react";
import {Camera, Code, Pyramid} from "lucide-react";
import ExtLink from "@/components/ExtLink";

export type CommentType = Tables<"comments"> & {
    profiles: Tables<"profiles"> | null
} & { children: CommentType[] }

type CommentWOChildren = Omit<CommentType, "children">;

type CommentSectionProps = {
    post_id: string,
    post_type: string,
    marked_comment?: number
    owner: string | null
}

/**
 * Comments are organised in a hierarchy pointing to their parent,
 * this function organises them into a tree structure that we can traverse **down**.
 * @param comments
 */
function organizeComments(comments: CommentWOChildren[]): CommentType[] {
    const commentsMap: { [key: number]: CommentType } = {};

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
    const supabase = await createClient();
    const {data: {user: user}, error: userError} = await supabase.auth.getUser();
    const {
        data: postComments,
        error: postCommentsError
    } = await supabase.from("posts").select("attached_comments").eq("id", Number(props.post_id)).single();

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
    } = await supabase.from("comments").select("*, profiles (*)").in("id", postComments.attached_comments);

    if (!comments) {
        return (
            <ServerError>
                {commentsError?.message}
            </ServerError>
        )
    }

    const resolvedComments = organizeComments(comments);

    return (
        <section className={cn("space-y-8 ", props.className)}>

            <header className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Join the Conversation
                </h2>
                <p className="text-muted-foreground">
                    We encourage you to ask questions, provide answers, and share your insights. Please be respectful and
                    considerate of others. We're all here to learn and grow together. Here are some things to keep in mind:
                </p>
                <ul className="flex flex-col text-muted-foreground gap-4">
                    <li className={"inline-flex gap-2 items-center"}>
                        <div className={"inline-block p-2 bg-secondary rounded-full"}>
                            <Pyramid className="h-6 w-6 text-foreground"/>
                        </div>
                        <p>Use LaTeX when you can.</p>
                    </li>
                    <li className={"inline-flex gap-2 items-center"}>
                        <div className={"inline-block p-2 bg-secondary rounded-full"}>
                            <Camera className="h-6 w-6 text-foreground"/>
                        </div>
                        <p>Embed images through links to hosting sites. (ex. Imgur)</p>
                    </li>
                    <li className={"inline-flex gap-2 items-center"}>
                        <div className={"inline-block p-2 bg-secondary rounded-full"}>
                            <Code className="h-6 w-6 text-foreground"/>
                        </div>
                        <p>Write code in code blocks, specifying the language using triple tildes.</p>
                    </li>
                </ul>
                <p className={"text-muted-foreground"}>
                    If you need reminders on how to format your text, you can always refer to the <ExtLink href={"https://ashki23.github.io/markdown-latex.html"} >markdown guide</ExtLink>.
                </p>
            </header>
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
