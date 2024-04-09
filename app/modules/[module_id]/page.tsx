import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import QuestionsDisplay from "@/components/QuestionsDisplay";

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
        <div className="w-full grid space-y-8">
            <header>
                <h1 className={"text-4xl uppercase font-bold"}>{module.id}</h1>
                <p className={"text-2xl leading-none"}>{module.description}</p>
            </header>
            <section className={"flex flex-col space-y-4 max-h-[1000px] md:h-[750px]"}>
                <div>
                    <h2 className={"text-3xl font-semibold"}>Questions</h2>
                    <p className={"text-muted-foreground"}>
                        These are questions that have been asked by students in this module. You can answer them if you
                        want.
                    </p>
                </div>
                <Separator/>
                <QuestionsDisplay target={module.id} tags={formattedTags || []}/>
                <Separator/>
            </section>
            <section>
                <h2>Useful resources</h2>
                <ul>
                    <li>Resource 1</li>
                    <li>Resource 2</li>
                    <li>Resource 3</li>
                    <li>Resource 4</li>
                </ul>
            </section>

        </div>
    )
}