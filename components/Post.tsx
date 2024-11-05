import {Tables} from "@/types/supabase";
import {cn} from "@/utils/cn";
import Profile from "@/components/Profile";
import {BookCopy, CheckCircle, Component} from "lucide-react";
import React from "react";
import Link, {LinkProps} from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

type PostProps = {
    post: Tables<'posts'> & {
        profiles: Tables<'profiles'> | null
    }
    type: "modules" | "topics"
};

/**
 * Displays a post with a heading, content, author and target.
 * @param props
 * @constructor
 */
export default function Post(props: PostProps & Omit<LinkProps, 'href'> & { className?: string }) {
    const {post, ...linkProps} = props;

    const formattedContent = post.content.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, '[LaTeX equation]');

    let targetIdentifier = null;
    switch (post.target_type) {
        case "module":
            targetIdentifier = <Component className={"h-3 w-3"}/>;
            break;
        case "topic":
            targetIdentifier = <BookCopy className={"h-3 w-3"}/>;
            break;
        default:
            break;
    }


    return (
        <Link {...linkProps} href={`/${props.type}/${post.target}/posts/${post.id}`}
              className={cn("flex flex-col border rounded-md p-4 transition-all hover:bg-accent focus:outline-foreground bg-popover", linkProps.className)}>
            <div>
                <h3 className={"text-xl font-bold text-ellipsis overflow-hidden break-words"}>{post.heading}</h3>
                <p className={"text-sm text-muted-foreground text-ellipsis overflow-hidden break-all max-h-10"}>{formattedContent}</p>
            </div>

            <div className={"inline-flex justify-between mt-2"}>
                <p className={"text-sm"}>
                    {post.profiles ?
                        !post.anonymous ?
                        <Profile profile={post.profiles}/> :
                            'Anonymous'
                        :
                        "Deleted User"
                    }
                </p>
                <div className={"inline-flex gap-2 "}>
                    {
                        post.type === "question" && post.marked_comment &&
                        <div className={"inline-flex flex-row text-green-600/90 text-xs items-center gap-1"}>
                            <CheckCircle className={'h-3 w-3'}/>
                            <p>Answered</p>
                        </div>
                    }

                    <div className={"inline-flex flex-row text-muted-foreground text-xs items-center gap-1"}>
                        {targetIdentifier}
                        <p>{post.target}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export const PostSkeleton = () => {
    return (
        <Skeleton
            className={"flex flex-col border rounded-md p-4 transition-all bg-muted"}>
            <Skeleton className={"space-y-4"}>
                <h3 className={"text-xl font-bold"}>
                    <Skeleton className={"w-1/2 bg-muted-foreground/5 h-6 rounded-md"}/>
                </h3>
                <Skeleton className={"w-1/3 bg-muted-foreground/5 h-4 rounded-md"}/>
                <Skeleton
                    className={"w-1/4 bg-muted-foreground/5 h-4 ml-auto"}
                />
            </Skeleton>
        </Skeleton>
    )
}
