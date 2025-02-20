"use server";
/*
Provides server actions for the ActionButtons, used in the comment component.
 */

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {Tables} from "@/types/supabase";
import {redirect} from "next/navigation";

export const markComment = async (
    comment: Tables<"comments">,
    postID: number,
) => {
    const client = await createClient();
    const {error} = await client
        .from("posts")
        .update({
            marked_comment: comment.id,
        })
        .eq("id", postID);

    if (error) {
        return redirect(`?error=` + error.message);
    }

    // Revalidate so the comment ordering and additional icons are updated.
    revalidatePath(`/posts/${postID}`);
};

export const unMarkComment = async (
    comment: Tables<"comments">,
    postID: number,
) => {
    const client = await createClient();
    const {error} = await client
        .from("posts")
        .update({
            marked_comment: null,
        })
        .eq("id", postID);

    if (error) {
        return redirect(`?error=` + error.message);
    }

    // Revalidate so the comment ordering and additional icons are updated.
    revalidatePath(`/posts/${postID}`);
};

export const reportComment = async (
    comment: Tables<"comments">,
) => {
    const client = await createClient();
    const {
        data: {user: user},
    } = await client.auth.getUser();
    if (user) {
        /*
            We want to see if the user has already reported this comment. Since users
            can only see their own reports we do not need to perform an equality test
            for the reporting user.
             */
        const {data: report, error: testError} = await client
            .from("comment_reports")
            .select("*")
            .eq("comment", comment.id);

        if (testError) {
            return redirect(`?error=` + testError.message);
        }

        /*
            RANT TIME:
            For **SOME** reason adding .single() to the report query, even WHEN the
            result is a non-zero array, yields null meaning we instead fetch ALL records
            under this user.

            WHY?? Why does it return null?? It shouldn't?!
             */
        if (report?.length === 0) {
            const {error} = await client
                .from("comment_reports")
                .insert({comment: comment.id});
            if (error) {
                return redirect(`?error=` + error.message);
            }
        }
        return;
    }
};

/*
Posts a comment to the database. If the comment has a parent, it will be added to the parent's children.
 */
export async function postComment(
    comment: string,
    isAnonymous: boolean,
    postID: number,
    parentID?: number,
) {
    const supabase = await createClient();

    const revertChanges = async () => {
        if (data) {
            try {
                const {data: deleted} = await supabase
                    .from("comments")
                    .delete()
                    .eq("id", data.id)
                    .select()
                    .single();
                if (!deleted) {
                    return redirect(
                        `/posts/${postID}?error=` + "No row deleted, possible policy issue",
                    );
                }
            } catch (e) {
                const error = e as Error;
                return redirect(`?error=` + error.message);
            }
        }
    };

    /*
    Insert the comment into the database.
     */
    const {data, error} = await supabase
        .from("comments")
        .insert({
            content: comment,
            anonymous: isAnonymous,
            parent: parentID,
        })
        .select()
        .single();

    if (error) {
        return redirect(`?error=` + error.message);
    }

    const {data: post, error: selectError} = await supabase.from("posts").select("*").eq("id", postID).single();

    if (selectError) {
        await revertChanges();
        return redirect(`?error=` + selectError.message);
    }

    await supabase.from("posts").update({
        attached_comments: [...post.attached_comments, data.id]
    }).eq("id", postID);


    revalidatePath(`/posts/${postID}`);
}

export async function deleteComment(commentID: number, postID: number) {
    const supabase = await createClient();

    const {data: children} = await supabase.from("comments").select("*").eq("parent", commentID);

    if (children && children.length > 0) {
        const {error: updateError} = await supabase
            .from("comments")
            .update({anonymous: true})
            .match({id: commentID});
        if (updateError) {
            return redirect(`?error=` + updateError.message);
        }
    } else {
        const {error: deleteError} = await supabase
            .from("comments")
            .delete()
            .eq("id", commentID)
            .single();
        if (deleteError) {
            return redirect(`?error=` + deleteError.message);
        }
    }

    revalidatePath(`/posts/${postID}`);
}
