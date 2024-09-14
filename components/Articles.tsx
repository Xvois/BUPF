'use client'

import {Tables} from "@/types/supabase";
import Image from "next/image";
import Profile from "@/components/Profile";
import {calcFittingCharacters, truncateMarkdown} from "@/utils/trunc";
import {Badge} from "@/components/ui/badge";
import Link, {LinkProps} from "next/link";
import {useEffect, useRef, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/utils/cn";
import {Skeleton} from "@/components/ui/skeleton";

/**
 * Displays an article with a header picture, heading, author, content, tags and a read more link.
 * The content is truncated to fit the height of the container dynamically.
 *
 * @example
 * const supabase = createClient();
 * const {data: article} = await supabase.from("posts").select("*, profiles(*)").eq("id", articleID).single();
 * //...
 * <Article article={article} />
 *
 * @param article The article object from the "posts" table, with the author profile linked from the "profiles" table.
 * @param props
 * @constructor
 */
export const Article = ({article, ...props}: {
    article: Tables<"posts"> & {
        profiles: (Tables<"profiles">) | null
    }
} & Omit<LinkProps, "href"> & { className?: string }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [fittingCharacters, setFittingCharacters] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (textRef.current) {
                const width = textRef.current.clientWidth;
                const height = textRef.current.clientHeight;
                const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize);
                setFittingCharacters(calcFittingCharacters(article.content, width, height, fontSize));
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (textRef.current) {
            resizeObserver.observe(textRef.current);
        }

        handleResize(); // Initial calculation

        return () => {
            if (textRef.current) {
                resizeObserver.unobserve(textRef.current);
            }
        };
    }, [article.content]);

    return (
        <Link href={`/articles/${article.id}`}
              {...props}
              className={cn("flex flex-row h-48 w-full max-w-screen-lg gap-4 p-4 items-center rounded-md border", props.className)}>
            {
                article.header_picture && <Image src={article.header_picture} alt={"temp alt"} width={400} height={400}
                                                 className={"hidden md:block rounded-md h-40 w-40 object-cover"}/>
            }
            <div className={"flex flex-col w-full gap-2"}>
                <div>
                    <h3 className={"text-xl font-semibold"}>
                        {article.heading}
                    </h3>
                    <p className={"text-sm"}>
                        by {article.profiles && <Profile profile={article.profiles}/>}
                    </p>
                </div>
                <div className={"h-full overflow-hidden"}>
                    <p ref={textRef} className={"w-full h-12 text-xs text-muted-foreground"}>
                        {truncateMarkdown(article.content, fittingCharacters)}
                    </p>
                </div>
                <Separator/>
                <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row gap-1"}>
                        {
                            article.tags.map(tag => (
                                <Badge variant={"secondary"} key={tag}>
                                    {tag}
                                </Badge>
                            ))
                        }
                    </div>
                    <p className={"text-sm text-muted-foreground"}>Read more</p>
                </div>
            </div>
        </Link>
    )
}

export const ArticleSkeleton = ({className}: {className?: string}) => {
    return (
        <div className={cn("flex flex-row h-48 w-full max-w-screen-lg gap-4 p-4 items-center rounded-md border", className)}>
            <div className={"flex flex-col w-full gap-2"}>
                <div>
                    <Skeleton className={"w-40 h-6"}/>
                    <Skeleton className={"w-20 h-4"}/>
                </div>
                <div className={"h-full overflow-hidden"}>
                    <Skeleton className={"w-full h-12"}/>
                </div>
                <Separator/>
                <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row gap-1"}>
                        <Skeleton className={"w-12 h-4"}/>
                        <Skeleton className={"w-8 h-4"}/>
                        <Skeleton className={"w-12 h-4"}/>
                    </div>
                    <Skeleton className={"w-12 h-4"}/>
                </div>
            </div>
        </div>
    )
}