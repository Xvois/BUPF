"use server"

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {formSchema} from "@/app/auth/reset/_schema/formSchema";
import {z} from "zod";


export const updatePassword = async (fd: z.infer<typeof formSchema>) => {
    const supabase = createClient();
    const {error} = await supabase.auth.updateUser({
        password: fd.password as string,
    })

    if (error) {
        return redirect("/auth/reset?error=" + error.message);
    }

    return redirect("/login");
}