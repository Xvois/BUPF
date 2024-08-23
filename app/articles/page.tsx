import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import {Package} from "lucide-react";
import {Article} from "@/components/Articles";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {createAPIParams} from "@/utils/api/helpers";
import {ArticlesResponse} from "@/types/api/articles/types";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

    const params = createAPIParams([], {id: "created_at", type: {ascending: false}}, 5)
    const {
        data: recentArticles,
        error: recentArticlesError
    } = await apiAxios.get("/api/articles", {searchParams: params.toString()}).then(res => res.data);

    if (recentArticlesError) {
        return new Error(recentArticlesError.message);
    }

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
                <h2 className={"font-semibold"}>Recent Articles</h2>
                <ArticlesCarousel articles={recentArticles}/>
            </section>
        </div>
    )
}

const ArticlesCarousel = ({articles}: { articles: ArticlesResponse["data"] }) => {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent>
                {
                    articles && articles.map((article) =>
                        <CarouselItem className="basis-1/2 2xl:basis-1/3">
                            <Article key={article.id} article={article}/>
                        </CarouselItem>
                    )
                }
            </CarouselContent>
        </Carousel>
    )
}