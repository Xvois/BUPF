'use server'
/*
Provides server actions for the ActionButtons, used in the comment component.
 */

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {Tables} from "@/types/supabase";

export const markComment = async (comment: Tables<"comments">, postID: number) => {
    const client = createClient();
    const {data, error} = await client.from("posts").update({
        marked_comment: comment.id
    }).eq("id", postID);

    if (error) {
        console.error(`Error marking comment: ${error.message}`);
        return;
    }

    // Revalidate so the comment ordering and additional icons are updated.
    revalidatePath(`/posts/${postID}`);
}

export const unMarkComment = async (comment: Tables<"comments">, postID: number) => {
    const client = createClient();
    const {data, error} = await client.from("posts").update({
        marked_comment: null
    }).eq("id", postID);

    if (error) {
        console.error(`Error unmarking comment: ${error.message}`);
        return;
    }

    // Revalidate so the comment ordering and additional icons are updated.
    revalidatePath(`/posts/${postID}`);

}

export const reportComment = async (comment: Tables<"comments">, postID: number) => {
    const client = createClient();
    const {data: {user: user}, error: authError} = await client.auth.getUser();
    if (user) {
        /*
        We want to see if the user has already reported this comment. Since users
        can only see their own reports we do not need to perform an equality test
        for the reporting user.
         */
        const {data: report, error: testError} = await client.from("comment_reports")
            .select("*")
            .eq("comment", comment.id)

        if (testError) {
            throw new Error(`Failed to submit comment report: ${testError.message} (Test Error)`)
        }

        /*
        RANT TIME:
        For **SOME** reason adding .single() to the report query, even WHEN the
        result is a non-zero array yields null, meaning we instead fetch ALL records
        under this user.

        WHY?? Why does it return null?? It shouldn't?!
         */
        if (report?.length === 0) {
            const {error} = await client.from("comment_reports").insert({comment: comment.id})
            if (error) {
                throw new Error(`Failed to submit comment report: ${error.message}`)
            }
        }
        return;
    }
    {
        throw new Error(`Failed to submit comment report: ${authError?.message} (Auth Error)`)
    }
}
/*
Posts a comment to the database. If the comment has a parent, it will be added to the parent's children.
 */
export async function postComment(comment: string, isAnonymous: boolean, postID: number, parentID?: number) {
    const supabase = createClient();
    const {data, error} = await supabase.from("comments").insert({
        content: comment,
        anonymous: isAnonymous,
    }).select().single()

    if (error) {
        throw new Error(`Error posting comment: ${error.message}`);
    }

    const revertChanges = async () => {
        if (data) {
            try {
                const {data: deleted} = await supabase.from("comments").delete().eq("id", data.id).select().single();
                if(!deleted) {
                    throw new Error("No row deleted, possible policy issue.")
                }
            } catch (e) {
                const error = e as Error;
                throw new Error("Critical error: Failed to revert changes after unsuccessful comment post: " + error.message)
            }
        }
    }

    /*
    If the comment has a parent, we need to update the parent comment to include.
     */
    if (parentID && data) {
        const {
            data: parent,
            error: selectError
        } = await supabase.from("comment_children").select("children").eq("id", parentID).single();

        if (selectError || !parent || parent.children === null) {
            if (selectError) {
                await revertChanges();
                throw new Error(`Error selecting comment: ${selectError.message}`);
            } else {
                await revertChanges();
                throw new Error(`Error selecting comment: Parent: ${!!parent} | Children: ${parent.children?.length}.`);
            }
        }

        const {data: parentAfter, error: updateError} = await supabase.from("comment_children").update({
            children: [...parent.children, data.id]
        }).eq("id", parentID).select('children');

        if(parentAfter?.length === 0) {
            await revertChanges();
            throw new Error(`Error updating comment: No row updated, possible policy issue.`);
        }

        if (updateError) {
            await revertChanges()
            throw new Error(`Error updating comment: ${updateError.message}`);
        }
    }


    const {
        data: post,
        error: selectError
    } = await supabase.from("posts").select("tl_comments").eq("id", postID).single();

    if (selectError) {
        await revertChanges();
        throw new Error(`Error selecting post: ${selectError.message}`);
    }

    /*
    Update the post to include the new comment, if it is not a reply.
     */
    if (post && data && !parentID) {
        const {error: updateError} = await supabase.from("posts").update({
            tl_comments: [...post.tl_comments, data.id]
        }).eq("id", postID);
        if (updateError) {
            await revertChanges();
            throw new Error(`Error updating post: ${updateError.message}`);
        }
    }

    revalidatePath(`/posts/${postID}`);
}