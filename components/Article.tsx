import {Tables} from "@/types/supabase";
import Image from "next/image";
import Profile from "@/components/Profile";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Link from "next/link";

type ArticleProps = {
	article: Tables<'posts'> & {
		profiles: Tables<'profiles'> & {
			courses: Tables<'courses'> | null
		} | null
	}
};

export const Article = (props: ArticleProps) => {
	const article = props.article;
	const formattedContent = article.content.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, '[LaTeX equation]').slice(0, 300);
	return (
		<Link href={`/articles/${article.id}`} className={"border rounded-md overflow-hidden w-full max-w-screen-md"}>
			{
				article.header_picture && (
					<AspectRatio ratio={10 / 4}>
						<Image
							src={article.header_picture}
							className={"w-full h-full object-cover"}
							alt={article.heading}
							height={400}
							width={1000}
						/>
					</AspectRatio>
				)
			}
			<div className={"p-6 space-y-4"}>
				<div>
					<p className={"font-bold text-xl"}>{article.heading}</p>
					<Profile user={article.profiles}/>
				</div>
				<p className={"text-muted-foreground max-h-32"}>{formattedContent}...</p>
			</div>
		</Link>
	)
}