import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import {Article} from "@/components/Article";
import Image from "next/image";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Fragment} from "react";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import Profile from "@/components/Profile";
import truncateMarkdown from "@/utils/trunc";
import {Sparkle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

	const {data: articles} = await apiAxios.get("/api/articles").then(res => res.data);
	const featured = articles?.filter(a => a.tags.includes("featured"))[0];

	return (
		<div className={"space-y-8 w-full"}>
			<header className={"text-center overflow-hidden pt-8 px-8"}>
				<div className={"relative flex flex-col h-96 items-center align-middle justify-center space-y-8"}>
					<h1 className={"font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl"}>Articles</h1>
					<p>
						From the students and academics at the University of Bath.
					</p>
				</div>
			</header>
			<section>

			</section>
			<Separator/>
			{
				featured && (
					<Fragment>
						<section className={"p-6 space-y-8 grid gap-8 grid-rows-2 lg:grid-cols-3 lg:grid-rows-none"}>
							<div className={"flex flex-col row-span-1 lg:col-span-1 gap-4"}>
								<h2 className={"inline-flex items-center gap-2 font-bold"}><Sparkle className={"h-4" +
									" w-4"}/> Featured article</h2>
								<div>
									<h3 className={"font-black text-4xl"}>{featured.heading}</h3>
									by <Profile user={featured.profiles}/>
								</div>
								<AspectRatio ratio={10 / 4}>
									<Image
										src={featured.header_picture}
										alt={featured.heading}
										width={1000}
										height={400}
										className={"h-full w-full object-cover"}/>
								</AspectRatio>
							</div>
							<div className={"row-span-1 lg:col-span-2"}>
								<MarkdownRender>
									{truncateMarkdown(featured.content, 1000)}
								</MarkdownRender>
								<Button variant={"link"} asChild>
									<Link href={"/articles/" + featured.id}>Read more</Link>
								</Button>
							</div>
						</section>
						<Separator/>
					</Fragment>
				)
			}
			<section className={"p-6 space-y-8 h-full"}>
				<h2>Recent posts</h2>
				<div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
					{articles?.map(article => (
						<Article article={article} key={article.id}/>
					))}
				</div>
			</section>
		</div>
	)
}