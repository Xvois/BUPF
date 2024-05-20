import {Separator} from "@/components/ui/separator";
import {Package} from "lucide-react";
import {Suspense} from "react";
import {CoreModules} from "@/app/modules/components/CoreModules";
import {OptionalModules} from "@/app/modules/components/OptionalModules";
import {ModulesSkeleton} from "@/app/modules/components/ModulesSkeleton";


export default function Modules() {
	return (
		<div className="w-full space-y-4">
			<header
				className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none">
				<div className={"inline-flex gap-2"}>
					<Package/>
					<p>Section</p>
				</div>
				<h1 className={"font-black text-4xl"}>Modules</h1>
				<p>
					View your modules, see what's coming up, and discuss with your peers.
				</p>
			</header>
			<Separator/>
			<section className={"space-y-4 p-6"}>
				<div>
					<h2 className={"text-2xl font-bold"}>Core modules</h2>
					<p className={"text-sm text-muted-foreground"}>
						These modules are mandatory for your course.
					</p>
				</div>
				<Suspense fallback={<ModulesSkeleton/>}>
					<CoreModules/>
				</Suspense>
			</section>
			<Separator/>
			<section className={"space-y-4 p-6"}>
				<div>
					<h2 className={"text-2xl font-bold"}>Core modules</h2>
					<p className={"text-sm text-muted-foreground"}>
						These modules are mandatory for your course.
					</p>
				</div>
				<Suspense fallback={<ModulesSkeleton/>}>
					<OptionalModules/>
				</Suspense>
			</section>
		</div>
	)
}
