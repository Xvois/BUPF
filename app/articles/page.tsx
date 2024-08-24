import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import {Package, PlusCircle} from "lucide-react";
import {Article, ArticleSkeleton} from "@/components/Articles";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {wrapQParams} from "@/utils/api/helpers";
import {ArticlesResponse} from "@/types/api/articles/types";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

    const articlesPerCarousel = 5;

    const recentParams = wrapQParams([], {id: "created_at", type: {ascending: false}}, articlesPerCarousel);
    const {
        data: recentArticles,
        error: recentArticlesError
    } = await apiAxios.get("/api/articles", {searchParams: recentParams.toString()}).then(res => res.data);
    if (recentArticlesError) {
        return new Error(recentArticlesError.message);
    }

    const popularParams = wrapQParams([], {id: "attached_comments", type: {ascending: false}}, articlesPerCarousel);
    const {
        data: popularArticles,
        error: popularArticlesError
    } = await apiAxios.get("/api/articles", {searchParams: popularParams.toString()}).then(res => res.data);
    if (popularArticlesError) {
        return new Error(popularArticlesError.message);
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
            <section className={"flex flex-col gap-4 p-6"}>
                <div>
                    <h2 className={"font-semibold"}>Popular Articles</h2>
                    <p>
                        Articles sorted by their engagement from your peers.
                    </p>
                </div>
                <ArticlesCarousel articles={popularArticles} articlesPerCarousel={articlesPerCarousel}/>
            </section>
            <section className={"flex flex-col gap-4 p-6"}>
                <div>
                    <h2 className={"font-semibold"}>Recent Articles</h2>
                    <p>
                        The latest articles written by your peers.
                    </p>
                </div>
                <ArticlesCarousel articles={recentArticles} articlesPerCarousel={articlesPerCarousel} />
            </section>
        </div>
    )
}

const ArticlesCarousel = ({articles, articlesPerCarousel}: { articles: ArticlesResponse["data"], articlesPerCarousel: number }) => {
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
                        <CarouselItem key={article.id} className="basis-[100%] lg:basis-1/2 2xl:basis-1/3">
                            <Article article={article}/>
                        </CarouselItem>
                    )
                }
                {
                    articles && articles?.length < articlesPerCarousel && [...Array(articlesPerCarousel - articles.length).keys()].map((i) =>
                        <CarouselItem key={i} className="basis-[100%] lg:basis-1/2 2xl:basis-1/3">
                            <Link
                                href={"/articles/editor"}
                                className={"relative flex flex-col h-48 w-full max-w-screen-lg gap-4 p-4 items-center justify-center rounded-md border"}>
                                <ArticleSkeleton className={"absolute -z-10 opacity-50"} />
                                <p className={"font-semibold"}>Create a new article</p>
                                <PlusCircle strokeWidth={1} size={48} className={"text-foreground"}/>
                            </Link>
                        </CarouselItem>
                    )
                }
            </CarouselContent>
        </Carousel>
    )
}