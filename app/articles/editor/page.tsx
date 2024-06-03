'use server'

import {createClient} from "@/utils/supabase/server";
import EditorForm from "@/app/articles/editor/_components/editor-form";

export default async function Editor({searchParams}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const supabase = createClient();
	const draftID = searchParams?.draftID as string | undefined;
	const {data: draft} = draftID ? await supabase.from("drafts").select("*").eq("id", draftID).single() : {data: null};
	const defaultValues = draft || {heading: "", content: ""};
	return (
		<EditorForm defaultValues={defaultValues} draftID={draft?.id}/>
	)
}