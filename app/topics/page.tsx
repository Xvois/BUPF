import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LinkBox from "@/components/LinkBox";
import {Separator} from "@/components/ui/separator";
import SectionHeader from "@/components/SectionHeader";
import {Package} from "lucide-react";


export default async function Modules() {
	const supabase = createClient();
	const {data: {user}} = await supabase.auth.getUser();
	if (!user) {
		return redirect("/login");
	}
	const {data: profile} = await supabase.from("profiles").select("*").eq("id", user.id).single();
	if (!profile) {
		return redirect("/login");
	}
	const {data: topics} = await supabase.from("topics").select("*");


	return (
		<div className="space-y-4">
			<SectionHeader
				icon={<Package/>}
				type={"Section"}
				title={"Modules"}
				description={"Explore the modules that are available to you."}
			/>
			<Separator/>
			<section className={"space-y-4 p-6"}>
				<div>
					<h2 className={"text-2xl font-bold"}>All topics</h2>
					<p className={"text-sm text-muted-foreground"}>
						Explore the topics that are available to you.
					</p>
				</div>
				<div className={"flex flex-row flex-wrap gap-4"}>
					{topics?.map(topic => (
						<LinkBox
							className={"flex-grow"}
							key={topic.id}
							title={topic.title}
							href={`/topics/${topic.id}`}
							description={topic.description || undefined}
						>
						</LinkBox>
					))}
				</div>
			</section>
		</div>
	)
}
