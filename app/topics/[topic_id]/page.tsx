import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {BookCopy} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import LinkBox from "@/components/LinkBox";
import Post from "@/components/Post";
import PostsDisplay from "@/components/PostsDisplay";

export default async function TopicPage({params}: { params: { topic_id: string } }) {

    const supabase = createClient();
    const {data: topic} = await supabase.from("topics").select("*").eq("id", params.topic_id).single();
    const {data: featuredDiscussions} = await supabase.from("posts").select("*, profiles (*)")
        .eq("target_type", "topic").eq("target", params.topic_id)
        .order("tl_comments", {ascending: false})
        .limit(3);

    const {data: recentDiscussions} = await supabase.from("posts").select("*, profiles (*)")
        .eq("target_type", "topic").eq("target", params.topic_id)
        .order("created_at", {ascending: false})
        .limit(3);

    console.log(topic, featuredDiscussions)

    if (!topic) {
        return redirect("/not-found");
    }


    return (
        <div className="w-full grid space-y-4">
            <header
                className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none"
            >
                <div className={"inline-flex gap-2"}>
                    <BookCopy/>
                    <p>Topic</p>
                </div>
                <h1 className={"font-black text-4xl uppercase"}>{topic.title}</h1>
                <p>
                    {topic.description}
                </p>
                <div className={"flex flex-row flex-wrap gap-2 mt-2"}>
                    <Button variant={"secondary"} className={"w-fit"} asChild>
                        <Link href={`/posts/new?type=discussion&target=${topic.id}`}>Start a discussion</Link>
                    </Button>
                </div>

            </header>
            <Separator/>
            <section className={"flex flex-col p-6 space-y-8"}>
                <div className={"space-y-4"}>
                    <div>
                        <h2 className={"text-2xl font-bold"}>Featured discussions</h2>
                        <p className={"text-muted-foreground"}>
                            Here are some active and interesting discussions on this topic that we think you may like.
                        </p>
                    </div>
                    <div className={"flex flex-coll gap-4"}>
                        {
                            featuredDiscussions?.map(discussion => (
                                <Post post={discussion} key={discussion.id}/>
                            ))
                        }
                    </div>
                </div>
                <div className={"space-y-4 h-[1000px] md:h-[750px]"}>
                    <div>
                        <h2 className={"text-2xl font-bold"}>All discussions</h2>
                        <p className={"text-muted-foreground"}>
                            All discussions on this topic.
                        </p>
                    </div>
                    <PostsDisplay target={params.topic_id} tags={[]}/>
                </div>
            </section>
            <Separator/>
            <section className={"p-6 space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Useful resources</h2>
                    <p className={"text-muted-foreground"}>
                        Here are some resources that you might find useful for this topic.
                    </p>
                </div>
                <div className={"flex flex-row flex-wrap gap-4"}>
                    <LinkBox className={"flex-grow"} title={"Charlie & Davids"} href={"/"}
                             description={"Covers thermodynamics and heat transfer."}/>
                    <LinkBox className={"flex-grow"} title={"Khan Academy"} href={"/"}
                             description={"Covers thermodynamics and heat transfer."}/>
                    <LinkBox className={"flex-grow"} title={"MIT OpenCourseWare"} href={"/"}
                             description={"Covers thermodynamics and heat transfer."}/>
                </div>
            </section>

        </div>
    )
}