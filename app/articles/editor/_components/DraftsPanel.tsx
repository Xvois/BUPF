'use client'

import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Suspense, useState} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";


export default function DraftsPanel() {
	const {data: response} = useSWR("/api/drafts", (url) => fetcher(url));
	const drafts = response?.data;
	const [isOpened, setIsOpened] = useState(false);
	return (
		<Sheet open={isOpened} onOpenChange={(state) => setIsOpened(state)}>
			<SheetTrigger asChild>
				<Button>
					Your drafts
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px] space-y-8">
				<SheetHeader>
					<SheetTitle>Your drafts</SheetTitle>
					<SheetDescription>
						Here you can see all the drafts you have created. You can also create a new draft by
						clicking
						the button
						below.
					</SheetDescription>
				</SheetHeader>
				<Button asChild>
					<Link onClick={() => setIsOpened(false)} href={"/articles/editor"}>
						New draft
					</Link>
				</Button>
				<Separator/>
				<ul className={"grid grid-cols-1 gap-4"}>
					<Suspense fallback={<div>Loading...</div>}>
						{drafts?.map(draft => (
							<li key={draft.id}>
								<Link onClick={() => setIsOpened(false)} href={`/articles/editor?draftID=${draft.id}`}>
									<p>
										{draft.heading}
									</p>
									<p className={"text-xs text-muted-foreground"}>
										{draft.content}
									</p>
								</Link>
							</li>
						))}
					</Suspense>
				</ul>
			</SheetContent>
		</Sheet>

	)
}