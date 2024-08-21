import LinkBox from "@/components/LinkBox";
import {cookies} from "next/headers";
import apiAxios from "@/utils/axios/apiAxios";
import InfoBox from "@/components/InfoBox";


export async function CoreModules() {
	const {data: modules} = await apiAxios.get("/api/user/modules", {}, {headers: {Cookie: cookies().toString()}}).then(res => res.data);


	return (
		<div className={"flex flex-wrap gap-4"}>
			{
				modules && modules?.required.length > 0 ?
					modules.required.map(module => (
						<LinkBox
							key={module.id}
							title={`${module.title} / ${module.id.toUpperCase()}`}
							href={`/modules/${module.id}`}
							className={"max-w-screen-sm flex-grow"}
							description={module.description || undefined}
						>
						</LinkBox>
					))
					:
					<InfoBox className={"border-dashed"} title={"No required modules available."}>
						Think this is a mistake? Contact a site admin.
					</InfoBox>
			}
		</div>
	)
}