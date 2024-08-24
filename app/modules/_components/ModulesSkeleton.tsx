import {LinkBoxSkeleton} from "@/components/LinkBox";

export const ModulesSkeleton = () => {
	return (
		<div className={"flex flex-row flex-wrap gap-4"}>
			<LinkBoxSkeleton className={"min-w-full h-[102px] sm:min-w-96 flex-grow"}/>
			<LinkBoxSkeleton className={"min-w-full h-[102px] sm:min-w-96 flex-grow"}/>
			<LinkBoxSkeleton className={"min-w-full h-[102px] sm:min-w-96 flex-grow"}/>
			<LinkBoxSkeleton className={"min-w-full h-[102px] sm:min-w-96 flex-grow"}/>
		</div>
	)
}