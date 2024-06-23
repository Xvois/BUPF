import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import Image from "next/image";
import truncateMarkdown from "@/utils/trunc";
import Profile from "@/components/Profile";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/supabase";
import SectionHeader from "@/components/SectionHeader";
import {Package} from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const hasHeaderPicture = (article: Tables<"posts">) => {
	return article.header_picture !== null;
}

export default async function Articles() {

	const {data: articles, error: articlesError} = await apiAxios.get("/api/articles").then(res => res.data);

	if (articlesError) {
		return new Error(articlesError.message);
	}

	const featured = articles?.filter(a => a.tags.includes("featured"))[0]
	return (
		<div className={"space-y-8 w-full"}>
			<SectionHeader
				icon={<Package/>}
				type={"Section"}
				title={"Articles"}
				description={"Read articles written by your peers and contribute your own."}
			/>
			<Separator/>
			<div className={"flex flex-row gap-4 p-6 py-0"}>
				<Button asChild>
					<Link href={"/articles/editor"}>
						Write an article
					</Link>
				</Button>
			</div>
			<Separator/>
            <section className={"grid md:grid-cols-1 lg:grid-cols-2 gap-4 p-6"}>
				{
					articles.map((article) => {
						if (hasHeaderPicture(article)) {
							return <LargeArticle key={article.id} article={article}/>
						} else {
							return <SmallArticle key={article.id} article={article}/>
						}
					})
				}
			</section>
		</div>
	)
}

const LargeArticle = ({article}: {
	article: Tables<"posts"> & {
		profiles: (Tables<"profiles"> & { courses: Tables<"courses"> | null }) | null
	}
}) => {

	if (article.header_picture === null) {
		throw new Error("LargeArticle must have a header picture.");
	}

	return (
        <div className={"flex flex-row gap-4 w-[768px] flex-grow"}>
			<Image
				src={article.header_picture}
				alt={article.heading}
				width={1000}
				height={400}
				className={"h-96 w-96 object-cover aspect-square rounded-md"}
			/>
            <article className={"inline-flex w-full flex-col gap-4"}>
				<div>
					<h2 className={"font-black text-2xl"}>{article.heading}</h2>
					{article.profiles?.courses && <Profile user={article.profiles}/>}
				</div>
				<p className={"text-sm text-muted-foreground"}>{truncateMarkdown(article.content, 200)}</p>
				<div className={"flex flex-col gap-4 mt-auto"}>
					<div className={"flex flex-row gap-2"}>
						{
							article.tags.map(tag => (
								<Badge variant={"secondary"} key={tag}>
									{tag}
								</Badge>
							))
						}
					</div>
					<Separator/>
					<Button variant={"link"} asChild>
						<Link href={`/articles/${article.id}`}>
							Read More
						</Link>
					</Button>
				</div>
			</article>
		</div>
	)
}

const SmallArticle = ({article}: {
	article: Tables<"posts"> & {
		profiles: (Tables<"profiles"> & { courses: Tables<"courses"> | null }) | null
	}
}) => {
	return (
        <Link href={`/articles/${article.id}`} className={"flex flex-row gap-2 w-96 h-48 border"}>
			{
				article.header_picture && (
					<Image
						src={article.header_picture}
						alt={article.heading}
						width={500}
						height={200}
						className={"h-24 w-24 object-cover aspect-square rounded-md"}
					/>
				)
			}
			<div className={"flex flex-col"}>
				<h3 className={"text-xl font-semibold"}>
					{article.heading}
				</h3>
				<p className={"text-xs text-muted-foreground"}>
					{truncateMarkdown(article.content, 100)}
				</p>
			</div>
		</Link>
	)
}