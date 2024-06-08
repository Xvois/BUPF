'use server'

import z from "zod";
import formSchema from "@/app/articles/editor/_schema/editorSchema";
import {createClient} from "@/utils/supabase/server";
import {redirect} from 'next/navigation'
import {uploadDraftPicture} from "@/app/articles/editor/_actions/handlePictures";

export async function handleSave(data: z.infer<typeof formSchema>, id?: number) {
	const supabase = createClient();
	const {data: {user}} = await supabase.auth.getUser();

	if (!user) {
		redirect("/articles/editor?error=No user found");
	}

	// Details of the picture upload
	let picture_text = undefined;

	// If a new header picture is uploaded, upload it to the server and get the public URL
	if (data.header_picture instanceof File) {
		const uploadRes = await uploadDraftPicture(data.header_picture);
		if (uploadRes?.error) {
			redirect(`/articles/editor?error=${uploadRes.error.message}`);
		}
		picture_text = uploadRes?.data?.path;
	}

	if (id) {
		const res = await supabase.from("drafts").update(
			{
				heading: data.heading,
				content: data.content,
				header_picture: picture_text
			}
		).eq("id", id);
		if (res.error) {
			redirect(`/articles/editor?error=${res.error.message}`)
		}
		return;
	} else {
		const res = await supabase.from("drafts").insert({
			heading: data.heading,
			content: data.content,
			header_picture: picture_text
		}).select("id").single();
		if (res.error) {
			redirect(`/articles/editor?error=${res.error.message}`);
		}
		return redirect(`/articles/editor?draftID=${res.data.id}`);
	}
}