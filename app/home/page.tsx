import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LinkBox from "@/components/LinkBox";
import {Separator} from "@/components/ui/separator";
import {cookies} from "next/headers";
import SectionHeader from "@/components/SectionHeader";
import {Home} from "lucide-react";
import NotablePosts from "@/app/home/_components/NotablePosts";

export default async function HomePage() {

    // Quick check that does not involve a query

    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const sbCookies = allCookies.filter(cookie => cookie.name.startsWith('sb-'));
    if (sbCookies.length === 0) {
        return redirect("/login");
    }

    // Full check that involves a query

    const supabase = createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/login");
    }


    return (
        <div className="w-full space-y-4">
            <SectionHeader title={"Bath University Physics Forum"}
                           description={"Discuss physics topics, ask questions, and share knowledge with your peers, all in one place."}
                           icon={<Home/>}
                           type={"Your home"}
            />
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
                    <h2 className={"text-2xl font-bold"}>Notable posts</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        Some of the most recent and popular posts on the forum, relevant to you.
                    </p>
                </div>
                <NotablePosts />
            </section>
        </div>
    );
}
