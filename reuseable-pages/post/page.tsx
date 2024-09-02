import {createClient} from "@/utils/supabase/server";
import Profile from "@/components/Profile";
import CommentSection from "@/components/Comments/CommentSection";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {Separator} from "@/components/ui/separator";
import {Component} from "lucide-react";
import Link from "next/link";
import {Metadata} from "next";

export async function generateMetadata(
	{params}: { params: { post_id: string }, searchParams: { sort?: string, tag?: string } },
): Promise<Metadata> {
	// read route params
	const id = params.post_id

	// fetch data
	const post = await fetch(`api/post/${id}`).then((res) => res.json())

	return {
		title: post.heading,
		description: post.content,
	}
}

export default async function PostPage({params}: { params: { post_id: string } }) {
	const supabse = createClient();
	const {data: post} = await supabse.from("posts").select("*, profiles (*, courses (*))").eq("id", params.post_id).single();

	if (post) {
		return (
			<article className={"w-full space-y-4"}>
				<header
					className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none break-words overflow-hidden">
					<Link href={`/modules/${post.target}`} className={"inline-flex gap-2"}>
						<Component/>
						<p>{post.target}</p>
					</Link>
					<h1 className={"font-black text-4xl"}>{post.heading}</h1>
					<p className={"text-sm"}>
						By {!post.anonymous ? <Profile user={post.profiles}/> :
						'Anonymous'}
					</p>
				</header>
				<div className={"p-6"}>
					<MarkdownRender>
						{post.content}
					</MarkdownRender>
					<div className={"w-fit ml-auto"}>
						<p className={"w-fit text-sm text-muted-foreground"} suppressHydrationWarning>
							Posted {new Date(post.created_at).toDateString()}
						</p>
					</div>
				</div>
				<Separator/>
				<CommentSection className={"p-6"} marked_comment={post.marked_comment || undefined}
								post_type={post.type}
								post_id={params.post_id} owner={post.owner}/>
			</article>
		)
	}
}
