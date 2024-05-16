import * as React from "react"
import {createClient} from "@/utils/supabase/server";
import NavMenu from "@/components/NavMenu";
import UserDropdown from "@/components/UserDropdown";
import {cookies} from "next/headers";
import apiAxios from "@/utils/axios/apiAxios";

export default async function TopBar() {

    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();

	const {data: modules} = await apiAxios.get("/api/user/modules", {}, {headers: {Cookie: cookies().toString()}}).then(res => res.data);
    const {data: topics} = await supabase.from('topics').select('*').limit(4)


    if (!user) {
        return <></>
    }

    return (
        <div
            className={"sticky top-0 left-0 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm bg-background/50 border-b border-border inline-flex w-full flex-row justify-between gap-x-10 px-4 py-2 z-50 mb-4"}>
            <NavMenu modules={modules?.required || null} topics={topics}/>
            <UserDropdown/>
        </div>
    )
}