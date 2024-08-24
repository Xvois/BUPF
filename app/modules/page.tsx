import {Separator} from "@/components/ui/separator";
import {Package} from "lucide-react";
import {CoreModules} from "@/app/modules/_components/CoreModules";
import {OptionalModules} from "@/app/modules/_components/OptionalModules";
import SectionHeader from "@/components/SectionHeader";

export const dynamic = 'auto';
export const revalidate = false;

export default async function Modules() {
	return (
		<div className="w-full space-y-4">
			<SectionHeader
				icon={<Package/>}
				type={"Section"}
				title={"Modules"}
				description={"Explore the modules that are available to you."}
			/>
			<Separator/>
			<section className={"space-y-4 p-6"}>
				<div>
					<h2 className={"text-2xl font-bold"}>Core modules</h2>
					<p className={"text-sm text-muted-foreground"}>
						These modules are mandatory for your course.
					</p>
				</div>
				<CoreModules/>
			</section>
			<Separator/>
			<section className={"space-y-4 p-6"}>
				<div>
					<h2 className={"text-2xl font-bold"}>Optional modules</h2>
					<p className={"text-sm text-muted-foreground"}>
						These are modules you can choose to take.
					</p>
				</div>
				<OptionalModules/>
			</section>
		</div>
	)
}
