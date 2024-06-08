'use server'

import z from "zod";
import formSchema from "@/app/articles/editor/_schema/editorSchema";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export async function handlePublish(data: z.infer<typeof formSchema>, draftID?: number) {
	const supabase = createClient();
	if (draftID) {
		const delRes = await supabase.from("drafts").delete().eq("id", draftID);
		if (delRes.error) {
			redirect("/articles/editor?error=" + delRes.error.message);
		}
	}
	const article = {
		...data,
		type: "article"
	} as const;
	const insRes = await supabase.from("posts").insert(article).select().single();
	if (insRes.error) {
		redirect("/articles/editor?error=" + insRes.error.message);
	}
	redirect(`/articles/${insRes.data.id}`);
}
