import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/supabase";
import SectionHeader from "@/components/SectionHeader";
import {Package} from "lucide-react";
import {Article} from "@/components/Articles";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const hasHeaderPicture = (article: Tables<"posts">) => {
    return article.header_picture !== null;
}

export default async function Articles() {

    const {data: articles, error: articlesError} = await apiAxios.get("/api/articles").then(res => res.data);

    if (articlesError) {
        return new Error(articlesError.message);
    }

    const featured = articles?.filter(a => a.tags.includes("featured"))[0]
    return (
        <div className={"space-y-4 w-full"}>
            <SectionHeader
                icon={<Package/>}
                type={"Section"}
                title={"Articles"}
                description={"Read articles written by your peers and contribute your own."}
            />
            <Separator/>
            <div className={"flex flex-row flex-wrap items-center p-6 py-0 gap-4"}>
                <p className={"font-semibold"}>Action Bar</p>
                <Separator orientation={"vertical"} className={"h-10"}/>
                <Button asChild>
                    <Link href={"/articles/editor"}>
                        Write an article
                    </Link>
                </Button>
            </div>
            <Separator/>
            <section className={"flex flex-col items-center justify-around gap-4 p-6"}>
                {
                    articles.map((article) =>
                        <Article key={article.id} article={article}/>
                    )
                }
            </section>
        </div>
    )
}
