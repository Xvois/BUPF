import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import PostsDisplay from "@/components/PostsDisplay/PostsDisplay";
import {Component} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import InfoBox from "@/components/InfoBox";
import QuestionButton from "@/app/modules/[module_id]/_components/QuestionButton";
import UsefulResourceButton from "@/app/modules/[module_id]/_components/UsefulResourceButton";
import Resource from "@/app/modules/[module_id]/_components/UsefulResources/Resource";

// @ts-expect-error Unknown types for dynamic APIs in NEXT 15
export default async function ModulePage({params}) {
    const supabase = await createClient();

    // See https://nextjs.org/docs/messages/sync-dynamic-apis
    const {module_id} = await params;

    // Grab the module or topic data
    const {data} = await supabase.from("modules").select("*").eq("id", module_id).single();
    if (!data) {
        return redirect("/not-found");
    }


    // Grab the resources for the module
    const {data: resourceData} = await supabase.from("module_resources").select("resources(*, owner(*))").eq("module", module_id);
    const resources = resourceData?.map((row) => row.resources);

    return (
        <div className="w-full grid space-y-4">
            <SectionHeader
                icon={<Component/>}
                type={"Module" }
                title={data.title}
                description={data.description ?? ""}
            />
            <Separator/>
            {/* Why does px-6 not work?? */}
            <div className={"flex flex-row flex-wrap items-center p-6 py-0 gap-4"}>
                <QuestionButton module_id={module_id} tags={data.tags} />
                <UsefulResourceButton module_id={module_id}/>
            </div>
            <Separator/>
            <section className="flex flex-col p-6 space-y-4 max-h-[1000px] md:h-[750px]">
                <div>
                    <h2 className="text-2xl font-bold">Questions</h2>
                    <p className="text-muted-foreground">
                        These are questions that have been asked by students in this module. You can answer them if you
                        want.
                    </p>
                </div>
                <PostsDisplay tags={data.tags || []} id={data.id}/>
            </section>
            {
                module_id && (
                    <>
                        <Separator/>
                        <section className="p-6 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">Useful resources</h2>
                                <p className="text-muted-foreground">
                                    Here are some resources that you might find useful for this module.
                                </p>
                            </div>
                            <div className="flex flex-row flex-wrap gap-4">
                                {
                                    resources?.map((resource) => (
                                        /* Types are not working on resource call for some reason @ts-expect-error */
                                        <Resource key={resource.id} resource={resource}/>
                                    ))
                                }
                                {
                                    resources?.length === 0 && (
                                        <InfoBox title={"No resources"} className={"w-full"}>
                                           No resources have been added yet. Be the first to add a
                                                resource!
                                        </InfoBox>
                                    )
                                }
                            </div>
                        </section>
                    </>
                )
            }
        </div>
    )
}