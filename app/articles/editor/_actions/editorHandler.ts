'use server'

import z from "zod";
import formSchema from "@/app/articles/editor/_schema/editorSchema";
import {createClient} from "@/utils/supabase/server";
import {redirect} from 'next/navigation'


export async function handlePublish(data: z.infer<typeof formSchema>) {
	console.log("Publishing article...");
}

export async function handleSave(data: z.infer<typeof formSchema>, id?: number) {
	const supabase = createClient();
	if (id) {
		const res = await supabase.from("drafts").update(data).eq("id", id);
		if (res.error) {
			console.error(res.error);
			return;
		}
		return;
	} else {
		const res = await supabase.from("drafts").insert(data).select("id").single();
		if (res.error) {
			console.error(res.error);
			return;
		}
		return redirect(`/articles/editor?draftID=${res.data.id}`);
	}
}