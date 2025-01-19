import React from "react";
import {createClient} from "@/utils/supabase/server";


export default async function AdminLayout({children}: { children: React.ReactNode; }) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return <div>Not authenticated</div>
    }

    const {data: profile} = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (!profile?.admin) {
        return <div>Not an admin</div>
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}