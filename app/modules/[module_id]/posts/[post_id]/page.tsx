import {createClient} from "@/utils/supabase/server";
import Profile from "@/components/Profile";
import CommentSection from "@/components/Comments/CommentSection";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {Separator} from "@/components/ui/separator";


export default async function PostPage({params}: { params: { post_id: string } }) {


    const supabse = createClient();
    const {data: post} = await supabse.from("posts").select("*, profiles (*)").eq("id", params.post_id).single();

    if (post) {
        return (
            <div className={"w-full space-y-4"}>
                <div className={"border rounded-lg p-8 space-y-8"}>
                    <div>
                        <h1 className={"text-4xl font-bold mb-0"}>{post.heading}</h1>
                        <p className={"text-sm"}>
                            By {!post.anonymous ? <Profile user={post.profiles}/> :
                            'Anonymous'}
                        </p>
                    </div>
                    <Separator />
                    <MarkdownRender markdown={post.content}/>
                    <div className={"w-fit ml-auto"}>
                        <p className={"w-fit text-sm text-muted-foreground"}>
                            Posted {new Date(post.created_at).toDateString()}
                        </p>
                    </div>
                </div>
                <CommentSection marked_comment={post.marked_comment || undefined} post_type={post.type}
                                post_id={params.post_id}/>
            </div>
        )
    }
}