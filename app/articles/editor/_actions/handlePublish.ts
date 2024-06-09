'use server'

import z from "zod";
import formSchema from "@/app/articles/editor/_schema/editorSchema";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {uploadPublishedPicture} from "@/app/articles/editor/_actions/handlePictures";

const deleteDraft = async (draftID: number) => {
	const supabase = createClient();
	const delRes = await supabase.from("drafts").delete().eq("id", draftID).select().single();
	if (delRes.error) {
		throw new Error(delRes.error.message);
	}
	const picturePath = delRes.data.header_picture;
	if (picturePath) {
		const pictureRes = await supabase.storage.from("article_images_drafts").remove([picturePath]);
		if (pictureRes.error) {
			throw new Error(pictureRes.error.message);
		}
	}
}

export async function handlePublish(data: z.infer<typeof formSchema>, draftID?: number) {
	const supabase = createClient();

	// Delete draft
	if (draftID) {
		try {
			await deleteDraft(draftID);
		} catch (e) {
			redirect("/articles/editor?error=" + (e as Error).message);
		}
	}

	let picturePath = undefined;

	// Upload picture
	if (data.header_picture instanceof File) {
		const pictureRes = await uploadPublishedPicture(data.header_picture);
		if (pictureRes?.error) {
			redirect("/articles/editor?error=" + pictureRes.error.message);
		}
		picturePath = pictureRes?.data?.path;
	}

	const {data: {publicUrl}} = picturePath ? supabase.storage.from("article_images_published").getPublicUrl(picturePath) : {data: {publicUrl: undefined}};

	const article = {
		...data,
		header_picture: publicUrl,
		type: "article"
	} as const;

	const insRes = await supabase.from("posts").insert(article).select().single();

	if (insRes.error) {
		redirect("/articles/editor?error=" + insRes.error.message);
	}
	redirect(`/articles/${insRes.data.id}`);
}
