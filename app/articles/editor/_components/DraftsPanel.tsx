import {createClient} from "@/utils/supabase/server";
import Link from "next/link";


export default async function DraftsPanel() {
	const supabase = createClient();
	const {data: drafts} = await supabase.from("drafts").select("*");

	return (
		<div className={"space-y-8 w-full"}>
			<section className={"p-6 space-y-8 h-full"}>
				<h2>Your drafts</h2>
				<ul className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
					<li>
						<Link href={"/articles/editor"}>
							<div
								className={"p-4 border rounded-md focus:outline-foreground hover:bg-gradient-to-br hover:from-muted/0 hover:to-muted/50"}>
								<h3 className={"text-xl font-semibold"}>Create a new draft</h3>
								<p className={"text-sm text-muted-foreground"}>Start writing a new article</p>
							</div>
						</Link>
					</li>
					{drafts?.map(draft => (
						<li key={draft.id}>
							<Link href={`/articles/editor?draftID=${draft.id}`}>
								<div
									className={"p-4 border rounded-md focus:outline-foreground hover:bg-gradient-to-br hover:from-muted/0 hover:to-muted/50"}>
									<h3 className={"text-xl font-semibold"}>{draft.heading}</h3>
									<p className={"text-sm text-muted-foreground"}>{draft.content}</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}