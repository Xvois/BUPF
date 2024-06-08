'use server'

import {createClient} from "@/utils/supabase/server";

export const uploadDraftPicture = async (picture: File) => {
	const supabase = createClient();
	const {data: {user}} = await supabase.auth.getUser();
	const {data: {session}} = await supabase.auth.getSession();
	if (!user || !session) {
		return {error: {message: "No user / session found"}};
	}
	const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article_headers/drafts/${user.id}/${picture.name}`, {
		method: 'HEAD',
		headers: {
			authorization: session.access_token,
		},
	});
	// The file already exists, so we do not need to upload it again
	if (response.ok) {
		return;
	} else {
		return await supabase.storage.from("article_images_drafts").upload(`${user.id}/${picture.name}`, picture);
	}
}