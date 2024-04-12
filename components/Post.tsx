import {Tables} from "@/types/supabase";
import {cn} from "@/lib/utils";
import Profile from "@/components/Profile";
import {CheckCircle, Component} from "lucide-react";
import React from "react";
import Link, {LinkProps} from "next/link";

type PostProps = {
    post: Tables<'posts'> & {
        profiles: Tables<'profiles'> | null
    }
};

export default function Post(props: PostProps & Omit<LinkProps,'href'> & { className?: string }) {
    const {post, ...linkProps} = props;

    const formattedContent = post.content.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, '[LaTeX equation]');

    let targetIdentifier = null;
    switch (post.target_type) {
        case "module":
            targetIdentifier = <Component className={"h-3 w-3"}/>;
            break;
        case "topic":
            targetIdentifier = <Component className={"h-3 w-3"}/>;
            break;
        default:
            break;
    }

    return (
        <Link {...linkProps} href={`/modules/${post.target}/posts/${post.id}`} className={cn("flex flex-col border rounded-md p-4 transition-all hover:bg-accent focus:outline-foreground bg-popover w-full", linkProps.className)}>
            <div>
                <h3 className={"text-xl font-bold"}>{post.heading}</h3>
                <p className={"text-sm text-muted-foreground text-ellipsis overflow-hidden max-h-10"}>{formattedContent}</p>
            </div>

            <div className={"inline-flex justify-between mt-2"}>
                <Profile user={post.profiles}/>
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