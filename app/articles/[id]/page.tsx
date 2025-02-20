import {createClient} from "@/utils/supabase/server";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Image from "next/image";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import Profile from "@/components/Profile";
import CommentSection from "@/components/Comments/CommentSection";
import {Separator} from "@/components/ui/separator";


// @ts-expect-error Unknown types for dynamic APIs change with NEXT 15, see page route for expected params
export default async function ArticlePage({params}) {

	// See https://nextjs.org/docs/messages/sync-dynamic-apis
	const {id} = await params;

	const supabase = await createClient();

	const {data: post} = await supabase.from("posts").select("*, profiles (*)").eq("id", Number(id)).single();

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<article className={"flex flex-col space-y-8 w-full h-full max-w-screen-lg p-16 border-l border-r"}>
			<div>
				<h1 className={"font-black text-5xl"}>{post.heading}</h1>
				by {post.profiles && <Profile profile={post.profiles}/>}
			</div>
			{
				post.header_picture && (
					<AspectRatio className={"scale-105"} ratio={10 / 4}>
						<Image src={post.header_picture} alt={"temp alt"}
							   width={1000} height={400} className={"h-full w-full object-cover"}/>
					</AspectRatio>
				)
			}
			<MarkdownRender>
				{post.content}
			</MarkdownRender>
			<Separator/>
			<CommentSection post_id={id} post_type={"article"} owner={post.owner}/>
		</article>
	)
}