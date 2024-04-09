import * as React from "react"
import {createClient} from "@/utils/supabase/server";
import NavMenu from "@/components/NavMenu";
import UserDropdown from "@/components/UserDropdown";


export default async function TopBar() {

    const supabase = createClient()
    const {data: modules} = await supabase.from('modules').select('*')
    const {data: topics} = await supabase.from('topics').select('*')


    return (
        <div className={"inline-flex w-full flex-col-reverse sm:flex-row items-center justify-center gap-x-10 my-4"}>
            <NavMenu modules={modules} topics={topics}  />
            <UserDropdown />
        </div>

    )
}


