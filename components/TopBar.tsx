import * as React from "react"
import {createClient} from "@/utils/supabase/server";
import NavMenu from "@/components/NavMenu";
import UserDropdown from "@/components/UserDropdown";
import {getUserModules} from "@/utils/getUserModules";


export default async function TopBar() {

    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();

    const {data: profile} = user ? await supabase.from('profiles').select('*, courses (*)').eq('id', user.id).single() : {data: null}
    const {data: modules} = profile ? await getUserModules(supabase, profile) : {data: null}

    const {data: topics} = await supabase.from('topics').select('*')


    return (
        <div className={"inline-flex w-full flex-col-reverse sm:flex-row items-center justify-center gap-x-10 my-4"}>
            <NavMenu modules={modules?.required || null} topics={topics}  />
            <UserDropdown />
        </div>

    )
}


