"use server";


import {z} from "zod";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";
import {postSchema} from "@/app/modules/[module_id]/_schema/postSchema";

export default async function uploadPost(values: z.infer<typeof postSchema>) {

	const headersList = headers();
	const fullUrl = (await headersList).get('referer') || "";

	// Create a new URL object from the fullUrl
	const url = new URL(fullUrl);

	// Extract the path by subtracting the domain from the full URL
	const path = url.href.replace(url.origin, '');

	const supabase = await createClient();

	const postObject = {
		heading: values.heading,
		content: values.content,
		type: values.type,
		target: values.target,
		target_type: "question",
		tags: values.tags,
		anonymous: values.anonymous,
	}

	const {error: postError} = await supabase.from("posts").insert(postObject).select();

	if (postError) {
		throw new Error(`Failed to post: ${postError.message}`);
	}

	return revalidatePath(path, "page");
};