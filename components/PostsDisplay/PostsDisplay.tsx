'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {TagIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {Tables} from "@/types/supabase";
import Post from "@/components/Post";

export function PostsDisplay({
								 id,
								 tags
							 }: {
	id: string;
	searchParams?: { sort?: string; tag?: string };
	tags: string[];
}) {


	const [params, setParams] = useState({
		tag: '',
		sort: 'rel'
	})

	const [posts, setPosts] = useState<Array<Tables<"posts"> & {profiles: Tables<"profiles"> | null} >>([]);
	const [parsedPosts, setParsedPosts] = useState<Array<Tables<"posts"> & {profiles: Tables<"profiles"> | null} >>([]);

	const supabase = createClient();

	useEffect(() => {
		supabase.from("posts").select("*, profiles (*)").eq("target", id).then(({data, error}) => {
			if (error) {
				console.error(error);
				return;
			}
			setPosts(data);
		});
	}, []);

	useEffect(() => {
		if(params.tag === '') {
			setParsedPosts(posts);
			return
		} else {
			const filteredPosts = posts.filter(post => post.tags.includes(params.tag));
			setParsedPosts(filteredPosts);
		}
	}, [posts, params.tag]);

	return (
		<div className={"flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 flex-grow overflow-hidden"}>
			<div className={"space-y-4 flex flex-col flex-grow min-w-40 md:max-w-[350px] border rounded-md md:flex-[1_1_0%]"}>
				<div className="p-4 border-b border-border">
					<h3 className={"text-xl font-bold"}>
						Filters
					</h3>
					<p className={"text-sm text-muted-foreground"}>
						Filter posts by tag or sort them by relevance or date posted.
					</p>
				</div>
				<div className="p-4 space-y-4">
					<Select defaultValue={"rel"} onValueChange={(e) =>
						setParams((prevParams) => ({...prevParams, sort: e}))
					} name={"sort"}>
						<SelectTrigger>
							<SelectValue>
								{params.sort === "rel" ? "Relevance" : params.sort === "asc" ? "Date posted (ascending)" : "Date posted (descending)"}
							</SelectValue>
							<SelectContent>
								<SelectItem value={"rel"}>Relevance</SelectItem>
								<SelectItem value={"asc"}>Date posted (ascending)</SelectItem>
								<SelectItem value={"desc"}>Date posted (descending)</SelectItem>
							</SelectContent>
						</SelectTrigger>
					</Select>
					{
						tags.length > 0 &&
						<>
							<div className={"rounded-md bg-gradient-to-b from-muted/50 to-muted p-6"}>
								<p className={"inline-flex items-center gap-2 font-semibold"}><span><TagIcon
									className={'h-4 w-4'}/></span> Tags</p>
								<p className={"text-sm text-muted-foreground"}>Posts are automatically tagged
									according to
									their contents.</p>
							</div>
							<ToggleGroup type="single" className={"group w-full flex flex-row flex-wrap"}
										 onValueChange={(e) =>
											 setParams((prevParams) => ({...prevParams, tag: e}))}
							>
								{
									tags.map((tag) => (
										<ToggleGroupItem
											className={`capitalize flex-grow border border-border rounded-md transition-all px-2 py-1 ${params.tag !== '' && tag !== params.tag && "opacity-50 scale-95"}`}
											type={"button"}
											key={tag}
											value={tag}
										>
											{tag}
										</ToggleGroupItem>
									))
								}
							</ToggleGroup>
						</>
					}
				</div>
			</div>
			<div className={"flex-grow md:flex-[3_1_0%] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400"}>
				{
					parsedPosts.map((post) => (
						<div key={post.id + post.heading} className={"mb-4"}>
							<Post post={post} />
						</div>
					))
				}
			</div>
		</div>
	)

}


export default PostsDisplay;
