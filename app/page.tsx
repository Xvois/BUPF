import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LinkBox from "@/components/LinkBox";
import {Separator} from "@/components/ui/separator";

export default async function ProtectedPage() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const {
        data: profile,
    } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (!profile) {
        return redirect("/login");
    }


    return (
        <div className="space-y-4">
            <header className={"p-6"}>
                <p className={"text-3xl leading-none"}>Welcome to the</p>
                <h1 className={"font-black text-4xl"}>Bath University Physics Forum</h1>
                <p>
                    Discuss physics topics, ask questions, and share knowledge with your peers, all in one place.
                </p>
            </header>
            <Separator/>
            <section className={"space-y-4 p-6"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Forum sections</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        Choose an area of the forum to view. Subsections within each area are available.
                    </p>
                </div>
                <div className={"flex flex-row flex-wrap gap-4"}>
                    <LinkBox title={"Modules"} href={"/modules"} className={"flex-grow"}
                             description={"View your modules, see what's coming up, and discuss with your peers."}/>
                    <LinkBox title={"Topics"} href={"/topics"} className={"flex-grow"}
                             description={"Discuss physics topics with your peers, ask questions, and share knowledge."}/>
                    <LinkBox title={"Articles"} href={"/articles"} className={"flex-grow"}
                             description={"Write and read articles on physics topics, share your knowledge and learn from others."}/>
                </div>
            </section>
            <Separator/>
            <section className={"space-y-4 p-6"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Contribute</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        Got an idea for an article? Want to ask a question? Want to share your knowledge? Click below to
                        get
                        started.
                    </p>
                </div>
                <div className={"flex flex-row flex-wrap gap-4"}>
                    <LinkBox title={"Start a discussion"} href={"/posts/new?type=discussion"} className={"flex-grow"}
                             description={"Discuss any topics in physics and engage with your peers to share ideas."}/>
                    <LinkBox title={"Write an article"} href={"/posts/new?type=article"} className={"flex-grow"}
                             description={"Write an article about something that interests you for your peers to read."}/>
                </div>
            </section>
            <Separator/>
        </div>
    );
}
