import LinkBox from "@/components/LinkBox";
import {createClient} from "@/utils/supabase/server";
import {getUserModules} from "@/utils/getUserModules";
import {redirect} from "next/navigation";

export async function CoreModules() {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return redirect("/login");
    }
    const {data: profile} = await supabase.from("profiles").select("*, courses (*)").eq("id", user.id).single();
    if (!profile) {
        return redirect("/login");
    }

    const {data: modules} = await getUserModules(supabase, profile)
    if (modules === null) {
        return redirect("/login");
    }

    const postsCount = Object.fromEntries(await Promise.all(modules.required.map(async (module) => {
        const answeredPosts = await supabase.from("posts").select("id", {
            count: 'exact',
            head: true
        }).eq("target", module.id).not("marked_comment", 'is', null);

        const unansweredPosts = await supabase.from("posts").select("id", {
            count: 'exact',
            head: true
        }).eq("target", module.id).is("marked_comment", null);

        return [module.id, {
            answered: answeredPosts.count,
            unanswered: unansweredPosts.count
        }];
    })));

    return (
        <section className={"space-y-4 p-6"}>
            <div>
                <h2 className={"text-2xl font-bold"}>Core modules</h2>
                <p className={"text-sm text-muted-foreground"}>
                    These modules are mandatory for your course.
                </p>
            </div>
            <div className={"flex flex-wrap gap-4"}>
                {
                    modules && modules?.required.length > 0 ?
                        modules.required.map(module => (
                            <LinkBox
                                key={module.id}
                                title={`${module.title} / ${module.id.toUpperCase()}`}
                                href={`/modules/${module.id}`}
                                className={"max-w-screen-sm flex-grow"}
                                description={module.description || undefined}
                            >
                                <div className={"inline-flex gap-1 items-center text-sm "}>
                                    <p>{postsCount[module.id].unanswered || 0} open</p>
                                    /
                                    <p className={"text-green-600/90"}>{postsCount[module.id].answered || 0} answered</p>
                                </div>
                            </LinkBox>
                        ))
                        :
                        <div className={"p-4 border rounded-md text-center"}>
                            <p>No required modules available.</p>
                            <p className={"text-sm text-muted-foreground"}>Think this is a mistake? Contact a
                                site
                                admin.</p>
                        </div>
                }
            </div>
        </section>
    )
}