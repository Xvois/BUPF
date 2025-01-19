'use server'

import {createClient} from "@/utils/supabase/server";
import crypto from 'crypto';

async function createUniqueName(blob: Blob): Promise<string> {
    // Convert Blob to Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Create a hash of the file
    const hash = crypto.createHash('sha256');
    hash.update(uint8Array);
    return hash.digest('hex');
}
export const uploadDraftPicture = async (picture: File) => {
	const supabase = await createClient();
	const {data: {user}} = await supabase.auth.getUser();
	const {data: {session}} = await supabase.auth.getSession();
	if (!user || !session) {
		return {error: {message: "No user / session found"}};
	}
	const uniqueName = await createUniqueName(picture);
	const response = await supabase.storage.from("article_images_drafts").list(`${user.id}`);

	if (response.error) {
		return {error: {message: response.error.message}};
	}

	const exists = response.data.some((file) => file.name === uniqueName);

	// The file already exists, so we do not need to upload it again
	if (exists) {
		return;
	} else {
		return await supabase.storage.from("article_images_drafts").upload(`${user.id}/${uniqueName}`, picture);
	}
}

export const uploadPublishedPicture = async (picture: File) => {
	const supabase = await createClient();
	const {data: {user}} = await supabase.auth.getUser();
	const {data: {session}} = await supabase.auth.getSession();
	if (!user || !session) {
		return {error: {message: "No user / session found"}};
	}

	const uniqueName = await createUniqueName(picture);

	const {data: {publicUrl}} = supabase.storage.from("article_images_published").getPublicUrl(`${user.id}/${uniqueName}`);
	const response = await fetch(publicUrl, {method: 'HEAD'});

	// The file already exists, so we do not need to upload it again
	if (response.ok) {
		return {data: {path: `/${user.id}/${uniqueName}`}};
	} else {
		return await supabase.storage.from("article_images_published").upload(`${user.id}/${uniqueName}`, picture);
	}
}