import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LinkBox from "@/components/LinkBox";
import {Separator} from "@/components/ui/separator";
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
            <header
                className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none"
            >
                <div className={"inline-flex gap-2"}>
                    <Package/>
                    <p>Section</p>
                </div>
                <h1 className={"font-black text-4xl"}>Topics</h1>
                <p>
					View topics, see what`&apos;`s coming up, and discuss with your peers.
                </p>
            </header>
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
