import {createClient} from "@/utils/supabase/server";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Image from "next/image";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import Profile from "@/components/Profile";
import CommentSection from "@/components/Comments/CommentSection";
import {Separator} from "@/components/ui/separator";


export default async function ArticlePage({params}: { params: { id: string } }) {
	const supabase = createClient();

	const {data: post} = await supabase.from("posts").select("*, profiles (*, courses (*))").eq("id", params.id).single();

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<div className={"flex flex-col space-y-8 w-full max-w-screen-md py-16"}>
			<div>
				<h1 className={"font-black text-5xl"}>{post.heading}</h1>
				by <Profile user={post.profiles}/>
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
			<CommentSection post_id={params.id} post_type={"article"} owner={post.owner}/>
		</div>
	)
}