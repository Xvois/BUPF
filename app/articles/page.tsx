import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import {Package, PlusCircle} from "lucide-react";
import {Article, ArticleSkeleton} from "@/components/Articles";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {createClient} from "@/utils/supabase/server";
import {Tables} from "@/types/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

    const supabase = await createClient();

    const articlesPerCarousel = 5;

    const {data: recentArticles} = await supabase.from("posts").select("*, profiles (*)").eq("type", "article").order("created_at", {ascending: false}).limit(articlesPerCarousel);

    const {data: popularArticles} = await supabase.from("posts").select("*, profiles (*)").eq("type", "article").order("attached_comments", {ascending: false}).limit(articlesPerCarousel);

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

const ArticlesCarousel = ({articles, articlesPerCarousel}: { articles: Array<Tables<"posts"> & {profiles: Tables<"profiles"> | null}> | null, articlesPerCarousel: number }) => {
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