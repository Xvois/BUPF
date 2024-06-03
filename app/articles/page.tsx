import {Separator} from "@/components/ui/separator";
import apiAxios from "@/utils/axios/apiAxios";
import {Article} from "@/components/Article";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Articles() {

	const {data: articles} = await apiAxios.get("/api/articles").then(res => res.data);
	const featured = articles?.filter(a => a.tags.includes("featured"));

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