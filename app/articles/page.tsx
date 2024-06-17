import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import Image from "next/image";
import truncateMarkdown from "@/utils/trunc";
import Profile from "@/components/Profile";
import Link from "next/link";
import {Package} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

	const {data: articles} = await apiAxios.get("/api/articles").then(res => res.data);
	const featured = articles?.filter(a => a.tags.includes("featured"))[0]
	return (
		<div className={"space-y-8 w-full"}>
			<header className={"flex flex-col p-6 h-40 justify-center"}>
				<div className={"inline-flex gap-2"}>
					<Package/>
					<p>Section</p>
				</div>
				<h1 className={"font-black text-4xl"}>Articles</h1>
				<p>
					Write and read articles on physics topics, share your knowledge and learn from others.
				</p>
			</header>
			<Separator/>
			<div className={"flex flex-row gap-4 p-6 py-0"}>
				<Button asChild>
					<Link href={"/articles/editor"}>
						Write an article
					</Link>
				</Button>
			</div>
			<Separator/>
			<section className={"flex flex-col mx-auto w-fit p-6 space-y-8 h-full flex-wrap gap-4"}>
				<LargeArticleBlock articles={[featured, featured, featured, featured]}/>
			</section>
		</div>
	)
}

const LargeArticleBlock = ({articles}: {
	articles: (Tables<"posts"> & {
		profiles: (Tables<"profiles"> & { courses: Tables<"courses"> | null }) | null
	})[]
}) => {
	return (
		<div className={"flex flex-row gap-8"}>
			<LargeArticle article={articles[0]} key={articles[0].id}/>
			<div className={"flex flex-col justify-around"}>
				<SmallArticle article={articles[1]} key={articles[1].id}/>
				<SmallArticle article={articles[2]} key={articles[2].id}/>
				<SmallArticle article={articles[3]} key={articles[3].id}/>
			</div>
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
		<div className={"flex flex-row gap-4 w-full max-w-screen-md flex-grow"}>
			<Image
				src={article.header_picture}
				alt={article.heading}
				width={1000}
				height={400}
				className={"h-96 w-96 object-cover aspect-square rounded-md"}
			/>
			<article className={"inline-flex flex-col gap-4"}>
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
		<Link href={`/articles/${article.id}`} className={"flex flex-row gap-2 max-w-96"}>
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