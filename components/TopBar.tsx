import * as React from "react"
import {createClient} from "@/utils/supabase/server";
import NavMenu from "@/components/NavMenu";
import UserDropdown from "@/components/UserDropdown";
import {cookies} from "next/headers";
import apiAxios from "@/utils/axios/apiAxios";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const wrapperClass = "sticky top-0 left-0 h-16 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm" +
	" bg-background/50 border-b border-border inline-flex w-full flex-row items-center align-middle justify-between" +
	" gap-x-10 px-4" +
	" py-2 z-50 mb-4"

export default async function TopBar() {

	const supabase = createClient()
	const {data: {user}} = await supabase.auth.getUser();


	if (!user) {
		return (
			<div className={wrapperClass}>
				<Button className={"ml-auto"} size={"sm"} variant={"outline"} asChild>
					<Link href={"/login"}>
						Login
					</Link>
				</Button>
			</div>
		)
	}

	const {data: modules} = await apiAxios.get("/api/user/modules", {}, {headers: {Cookie: cookies().toString()}}).then(res => res.data);
	const {data: topics} = await supabase.from('topics').select('*').limit(4)

	return (
		<div
			className={wrapperClass}>
			<NavMenu modules={modules?.required || null} topics={topics}/>
			<UserDropdown/>
		</div>
	)
}

export const TopBarSkeleton = () => {
	return (
		<div className={wrapperClass}/>
	)
}