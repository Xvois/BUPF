import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import PostsDisplay from "@/components/PostsDisplay/PostsDisplay";
import {BookCopy, Component} from "lucide-react";
import LinkBox from "@/components/LinkBox";
import DiscussionButton from "@/reuseable-pages/combo-display/_components/DiscussionButton";
import QuestionButton from "@/reuseable-pages/combo-display/_components/QuestionButton";
import SectionHeader from "@/components/SectionHeader";

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

    const id = params.module_id || params.topic_id as string;

    const {data} = await supabase.from(params.module_id ? "modules" : "topics").select("*").eq("id", id).single();

    if (!data) {
        return redirect("/not-found");
    }

    // A valid type assertion as it **only** combines the two types to make tags optional
    const pageData = data as PageData;

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
            <Separator/>
            <section className="p-6 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">Useful resources</h2>
                    <p className="text-muted-foreground">
                        Here are some resources that you might find useful for this module.
                    </p>
                </div>
                <div className="flex flex-row flex-wrap gap-4">
                    <LinkBox title={"None available."} href={"#"}
                             description={"Please suggest useful resources for this module."} disabled/>
                </div>
            </section>
        </div>
    )
}