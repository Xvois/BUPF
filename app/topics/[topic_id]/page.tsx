import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import PostsDisplay from "@/components/PostsDisplay/PostsDisplay";
import {BookCopy} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function ModulePage({params, searchParams}: {
    params: { topic_id: string },
    searchParams: { sort?: string, tag?: string }
}) {
    const supabase = createClient();
    const {data: topic} = await supabase.from("topics").select("*").eq("id", params.topic_id).single();

    if (!topic) {
        return redirect("/not-found");
    }

    return (
        <div className="w-full grid space-y-4">
            <header
                className="flex h-full w-full select-none flex-col justify-end p-6 no-underline outline-none">
                <div className="inline-flex gap-2">
                    <BookCopy/>
                    <p>Topic</p>
                </div>
                <h1 className="font-black text-4xl uppercase break-words overflow-hidden">{topic.title}</h1>
                <p>{topic.description}</p>
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                    <Button variant="secondary" className="w-fit" asChild>
                        <Link href={`/posts/new?type=discussion&target=${topic.id}`}>Start a discussion</Link>
                    </Button>
                </div>
            </header>
            <Separator/>
            <section className="flex flex-col p-6 space-y-4 max-h-[1000px] md:h-[750px]">
                <div>
                    <h2 className="text-2xl font-bold">Discussions</h2>
                    <p className="text-muted-foreground">
                        These are discussions that have been started by students in this topic. You can contribute to
                        them if you want.
                    </p>
                </div>
                <PostsDisplay tags={[]} id={topic.id} type={"modules"} searchParams={searchParams}/>
            </section>
        </div>
    )
}