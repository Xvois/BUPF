import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import QuestionsDisplay from "@/components/QuestionsDisplay";
import {Component} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import LinkBox from "@/components/LinkBox";

export default async function ModulePage({params}: { params: { module_id: string, tag: string } }) {

    const supabase = createClient();
    const {data: module} = await supabase.from("modules").select("*").eq("id", params.module_id).single();


    if (!module) {
        return redirect("/not-found");
    }

    const formattedTags = module.tags?.map(tag => ({
        key: tag,
        value: tag.replace(/\b\w/g, char => char.toUpperCase()),
    }));

    return (
        <div className="w-full grid space-y-4">
            <header
                className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none"
            >
                <div className={"inline-flex gap-2"}>
                    <Component/>
                    <p>Module</p>
                </div>
                <h1 className={"font-black text-4xl uppercase"}>{module.id}</h1>
                <p>
                    {module.description}
                </p>
                <div className={"flex flex-row flex-wrap gap-2 mt-2"}>
                    <Button variant={"secondary"} className={"w-fit"} asChild>
                        <Link href={`/posts/new?type=question&target=${module.id}`}>Ask a question</Link>
                    </Button>
                </div>

            </header>
            <Separator/>
            <section className={"flex flex-col p-6 space-y-4 max-h-[1000px] md:h-[750px]"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Questions</h2>
                    <p className={"text-muted-foreground"}>
                        These are questions that have been asked by students in this module. You can answer them if you
                        want.
                    </p>
                </div>
                <QuestionsDisplay target={module.id} tags={formattedTags || []}/>
            </section>
            <Separator/>
            <section className={"p-6 space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Useful resources</h2>
                    <p className={"text-muted-foreground"}>
                        Here are some resources that you might find useful for this module.
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