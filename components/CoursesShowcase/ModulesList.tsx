import LinkBox from "@/components/LinkBox";
import {Tables} from "@/types/supabase";
import {CourseModules} from "@/types/api/courses/types";

export default function ModulesList({modules}: { modules: CourseModules | null }) {
	return (
		<ul className={"flex flex-col w-full h-full space-y-2"}>
			{
				modules && modules.required.map((module: Tables<"modules">) => (
					<li className={"flex w-full"} key={module.id}>
						<LinkBox
							key={module.id}
							title={`${module.title}`}
							href={`/modules/${module.id}`}
							className={"max-w-screen-2xl flex-grow h-fit animate-fade"}
							description={module.description || undefined}
						/>
					</li>
				))
			}
			{
				modules && modules.optional.map((module: Tables<"modules">) => (
					<li className={"flex w-full"} key={module.id}>
						<LinkBox
							key={module.id}
							title={`${module.title}`}
							href={`/modules/${module.id}`}
							className={"max-w-screen-2xl flex-grow h-fit animate-fade"}
							description={module.description || undefined}
						/>
					</li>
				))
			}
		</ul>
	);
}