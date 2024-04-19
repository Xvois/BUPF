import LinkBox from "@/components/LinkBox";
import {Badge} from "@/components/ui/badge";
import React from "react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {getUserModules} from "@/utils/getUserModules";


export async function OptionalModules() {
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
                <h2 className={"text-2xl font-bold"}>Optional modules</h2>
                <p className={"text-sm text-muted-foreground"}>
                    These are optional modules that not all students will take.
                </p>
            </div>
            <div className={"grid grid-cols-3 gap-4"}>
                {
                    modules && modules?.optional.length > 0 ?
                        modules.optional.map(module => (
                            <LinkBox
                                key={module.id}
                                title={module.id.toUpperCase()}
                                href={`/modules/${module.id}`}
                                description={module.description || undefined}
                            >
                                <div className={"flex w-full gap-2 flex-wrap"}>
                                    {module.tags?.map(tag => (
                                        <Badge key={tag} variant={"secondary"}>{tag}</Badge>
                                    ))}
                                </div>
                            </LinkBox>
                        ))
                        :
                        <div className={"p-4 border rounded-md text-center"}>
                            <p>No optional modules available.</p>
                            <p className={"text-sm text-muted-foreground"}>Think this is a mistake? Contact a
                                site
                                admin.</p>
                        </div>
                }
            </div>
        </section>

    )
}