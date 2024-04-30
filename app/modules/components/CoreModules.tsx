import LinkBox from "@/components/LinkBox";
import {Badge} from "@/components/ui/badge";
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
                                <div className={"flex w-full gap-2 flex-wrap mt-1"}>
                                    {module.tags?.map(tag => (
                                        <Badge key={tag} className={"rounded-md"} variant={"outline"}>{tag}</Badge>
                                    ))}
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