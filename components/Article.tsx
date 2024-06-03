import {Tables} from "@/types/supabase";
import Image from "next/image";
import Profile from "@/components/Profile";

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
		<div className={"border rounded-md overflow-hidden w-full max-w-screen-md"}>
			<div className={"h-96"}>
				<Image
					src={"https://uyadlyphtuclcowrmrem.supabase.co/storage/v1/object/public/profile_pictures/ad5e4de4-526f-42f5-9900-75fc035f0b0a"}
					className={"w-full h-full object-cover"}
					alt={article.heading}
					height={384}
					width={768}
				/>
			</div>
			<div className={"p-6 space-y-4"}>
				<div>
					<p className={"font-bold text-xl"}>{article.heading}</p>
					<Profile user={article.profiles}/>
				</div>
				<p className={"text-muted-foreground max-h-32"}>{formattedContent}...</p>
			</div>
		</div>
	)
}