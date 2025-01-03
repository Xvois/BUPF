import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import PostsDisplay from "@/components/PostsDisplay/PostsDisplay";
import {BookCopy, Component} from "lucide-react";
import DiscussionButton from "@/reuseable-pages/combo-display/_components/DiscussionButton";
import QuestionButton from "@/reuseable-pages/combo-display/_components/QuestionButton";
import SectionHeader from "@/components/SectionHeader";
import UsefulResourceButton from "@/reuseable-pages/combo-display/_components/UsefulResourceButton";
import Resource from "@/reuseable-pages/combo-display/_components/UsefulResources/Resource";
import InfoBox from "@/components/InfoBox";

type PageData = {
    created_at: string,
    title: string,
    description: string,
    tags?: string[]
    id: string,
}

export default async function ComboDisplay({params, searchParams}: {
    params: { module_id?: string, topic_id?: string, tag: string },
    searchParams: { sort?: string, tag?: string }
}) {
    const supabase = createClient();

    const isModule = !!params.module_id;

    if (!params.module_id && !params.topic_id) {
        return redirect("/not-found");
    }

    // Grab the module or topic data
    const id = params.module_id || params.topic_id as string;
    const {data} = await supabase.from(params.module_id ? "modules" : "topics").select("*").eq("id", id).single();
    if (!data) {
        return redirect("/not-found");
    }

    // A valid type assertion as it **only** combines the two types to make tags optional
    const pageData = data as PageData;

    // Grab the resources for the module
    const {data: resourceData} = params.module_id ? await supabase.from("module_resources").select("resources(*, owner(*))").eq("module", id) : {data: null};
    const resources = resourceData?.map((row) => row.resources);

    return (
        <div className="w-full grid space-y-4">
            <SectionHeader
                icon={isModule ? <Component/> : <BookCopy/>}
                type={isModule ? "Module" : "Topic"}
                title={pageData.title}
                description={pageData.description}
            />
            <Separator/>
            {/* Why does px-6 not work?? */}
            <div className={"flex flex-row flex-wrap items-center p-6 py-0 gap-4"}>
                <p className={"font-semibold"}>Action Bar</p>
                <Separator orientation={"vertical"} className={"h-10"}/>
                {
                    isModule ?
                        params.module_id &&
                        <QuestionButton module_id={params.module_id}/>
                        :
                        params.topic_id &&
                        <DiscussionButton topic_id={params.topic_id}/>
                }
                {
                    isModule && params.module_id && <UsefulResourceButton module_id={params.module_id}/>
                }
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
                <PostsDisplay tags={pageData.tags || []} id={data.id} type={params.module_id ? "modules" : "topics"}
                              searchParams={searchParams}/>
            </section>
            {
                params.module_id && (
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