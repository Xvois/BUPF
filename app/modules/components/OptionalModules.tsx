import LinkBox from "@/components/LinkBox";
import {cookies} from "next/headers";
import apiAxios from "@/utils/axios/apiAxios";

export async function OptionalModules() {
	const {data: modules} = await apiAxios.get("/api/user/modules", {}, {headers: {Cookie: cookies().toString()}}).then(res => res.data);
	return (
		<div className={"flex flex-wrap gap-4"}>
			{
				modules && modules?.optional.length > 0 ?
					modules.optional.map(module => (
						<LinkBox
							key={module.id}
							title={`${module.title} / ${module.id.toUpperCase()}`}
							href={`/modules/${module.id}`}
							className={"max-w-screen-sm flex-grow"}
							description={module.description || undefined}
						/>
					))
					:
					<div className={"p-4 border rounded-md text-center"}>
						<p>No optional modules available.</p>
						<p className={"text-sm text-muted-foreground"}>Think this is a mistake? Contact a
							site
							admin.</p>
					</div>
			}
		</div>
	)
}