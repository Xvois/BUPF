'use server'

import {createClient} from "@/utils/supabase/server";
import EditorForm from "@/app/articles/editor/_components/editor-form";
import DraftsPanel from "@/app/articles/editor/_components/DraftsPanel";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function Editor({searchParams}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const supabase = createClient();

	const {data: {user}} = await supabase.auth.getUser();
	const {data: {session}} = await supabase.auth.getSession();

	// This should never happen, middleware will redirect the user to the login page
	if (!user || !session) {
		return;
	}

	// Get the draft if a draftID is present
	const draftID = searchParams?.draftID as string | undefined;
	const {data: draft} = draftID ? await supabase.from("drafts").select("*").eq("id", draftID).single() : {data: null};


	const defaultValues = {
		heading: draft?.heading || "",
		content: draft?.content || "",
		header_picture: ""
	}

	return (
		<Card className={"border-none rounded-none shadow-none w-full max-w-screen-md"}>
			<CardHeader>
				<CardTitle>Article editor</CardTitle>
				<CardDescription>
					Here you can create a new article or edit an existing one. You can also save your progress as a
					draft.
				</CardDescription>
			</CardHeader>
			<CardContent className={"space-y-8"}>
				<DraftsPanel/>
				<EditorForm defaultValues={defaultValues} imagePath={draft?.header_picture ?? undefined}
							draftID={draft?.id}/>
			</CardContent>
		</Card>
	)
}