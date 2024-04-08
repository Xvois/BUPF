import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import LinkBox from "@/components/LinkBox";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";


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
    const {data: modules} = await supabase.from("modules").select("*").eq("year", profile.year);


    return (
        <div className="space-y-8">
            <header>
                <h1 className={"font-black text-4xl"}>Modules</h1>
                <p>
                    View your modules, see what's coming up, and discuss with your peers.
                </p>
            </header>
            <Separator/>
            <section className={"space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Core modules</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        These modules are mandatory for your course.
                    </p>
                </div>
                <div className={"flex flex-wrap gap-4"}>
                    {modules?.filter(module => !module.optional).map(module => (
                        <LinkBox
                            key={module.id}
                            title={module.id.toUpperCase()}
                            href={`/modules/${module.id}`}
                            className={"max-w-screen-lg flex-grow"}
                            description={module.description || undefined}
                        >
                            <div className={"flex w-full gap-2 flex-wrap mt-1"}>
                                {module.tags?.map(tag => (
                                    <Badge variant={"outline"}>{tag}</Badge>
                                ))}
                            </div>
                        </LinkBox>
                    ))}
                </div>
            </section>
            <Separator />
            <section className={"space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Optional modules</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        These are optional modules that not all students will take.
                    </p>
                </div>
                <div>
                    {
                        modules && modules?.filter(module => module.optional).length > 0 ?
                        modules.filter(module => module.optional).map(module => (
                        <LinkBox
                            key={module.id}
                            title={module.id.toUpperCase()}
                            href={`/modules/${module.id}`}
                            className={"max-w-screen-lg flex-grow md:w-1/2 lg:w-1/3 xl:w-1/4"}
                            description={module.description || undefined}
                        >
                            <div className={"flex w-full gap-2 flex-wrap"}>
                                {module.tags?.map(tag => (
                                    <Badge variant={"secondary"}>{tag}</Badge>
                                ))}
                            </div>
                        </LinkBox>
                    ))
                            :
                            <div className={"p-4 border rounded-md text-center"}>
                                <p>No optional modules available.</p>
                                <p className={"text-sm text-muted-foreground"}>Think this is a mistake? Contact a site admin.</p>
                            </div>
                    }
                </div>
            </section>
        </div>
    )
}