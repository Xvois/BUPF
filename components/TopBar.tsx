import * as React from "react"
import {createClient} from "@/utils/supabase/server";
import {getUserModules} from "@/utils/getUserModules";
import NavMenu from "@/components/NavMenu";
import UserDropdown from "@/components/UserDropdown";


export default async function TopBar() {

    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();

    const {data: profile} = user ? await supabase.from('profiles').select('*, courses (*)').eq('id', user.id).single() : {data: null}
    const {data: modules} = profile ? await getUserModules(supabase, profile) : {data: null}

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