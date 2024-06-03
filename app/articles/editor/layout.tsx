import DraftsPanel from "@/app/articles/editor/_components/DraftsPanel";
import {Suspense} from "react";


export default function EditorLayout({children}: { children: React.ReactNode }) {
	return (
		<div className={"flex flex-row w-full divide-x"}>
			<div className={"w-3/4"}>
				{children}
			</div>
			<div className={"w-1/4"}>
				<Suspense fallback={<div>Loading...</div>}>
					<DraftsPanel/>
				</Suspense>
			</div>
		</div>
	)
}