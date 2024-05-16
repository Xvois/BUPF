import LinkBox from "@/components/LinkBox";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import apiAxios from "@/utils/axios/apiAxios";


export async function CoreModules() {
	const {data: modules} = await apiAxios.get("/api/user/modules", {}, {headers: {Cookie: cookies().toString()}}).then(res => res.data);

	if (modules === null) {
		return redirect("/login");
	}


	return (
		<section className={"space-y-4 p-6"}>
			<div>
				<h2 className={"text-2xl font-bold"}>Core modules</h2>
				<p className={"text-sm text-muted-foreground"}>
					These modules are mandatory for your course.
				</p>
			</div>
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
						<div className={"p-4 border rounded-md text-center"}>
							<p>No required modules available.</p>
							<p className={"text-sm text-muted-foreground"}>Think this is a mistake? Contact a
								site
								admin.</p>
						</div>
				}
			</div>
		</section>
	)
}