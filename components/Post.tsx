import {Tables} from "@/types/supabase";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {cn} from "@/lib/utils";
import Profile from "@/components/Profile";
import {CircleCheck} from "lucide-react";

type PostProps = {
    post: Tables<'posts'> & {
        profiles: Tables<'profiles'> | null
    }
};

export default function Post(props: PostProps & React.HTMLAttributes<HTMLDivElement>) {
    const {post, ...divProps} = props;

    const formattedContent = post.content.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, '[LaTeX equation]');

    return (
        <Card {...divProps} className={cn("w-full max-w-screen-lg rounded-md", divProps.className)}>
            <Link className={"focus-visible:outline-foreground"}
                  href={`/${post.target_type}s/${post.target}/posts/${post.id}`}>
                <CardHeader className={"pt-6"}>
                    <h2 className="text-xl font-semibold">{post.heading}</h2>
                    <p className="text-sm leading-sm text-muted-foreground">
                        {formattedContent}
                    </p>
                </CardHeader>
            </Link>
            <CardFooter className={"justify-between"}>
                {!post.anonymous ?
                    <Profile user={post.profiles} />
                    :
                    <p className={"text-sm"}>Anonymous</p>
                }
                {post.type === "question" &&
                    (
                        post.marked_comment ?
                            <CircleCheck className={"w-6 h-6 text-green-500"}/>
                            :
                            <p className={"text-sm text-muted-foreground"}>No answer yet</p>
                    )
                }
            </CardFooter>
        </Card>
    )
}