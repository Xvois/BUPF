'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {headers} from "next/headers";

export const changePassword = async (fd: FormData) => {
    const origin = headers().get("origin");
    const supabase = createClient();

    const email = fd.get("email") as string;

    console.log(email);

    const {error} = await supabase.auth.resetPasswordForEmail(email,
        {
            redirectTo: `${origin}/auth/reset`
        });

    if (error) {
        return redirect("/forgot?error=" + error.message);
    }

    return redirect("/login");
};