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

export const Article = ({article, ...props}: {
    article: Tables<"posts"> & {
        profiles: (Tables<"profiles"> & { courses: Tables<"courses"> | null }) | null
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
              className={cn("flex flex-row h-52 w-full max-w-screen-lg gap-4 p-4 items-center rounded-md border", props.className)}>
            {
                article.header_picture && <Image src={article.header_picture} alt={"temp alt"} width={400} height={400}
                                                 className={"rounded-md h-44 w-44 object-cover"}/>
            }
            <div className={"flex flex-col w-full gap-2"}>
                <div>
                    <h3 className={"text-xl font-semibold"}>
                        {article.heading}
                    </h3>
                    <p className={"text-sm"}>
                        by {article.profiles?.courses && <Profile user={article.profiles}/>}
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
