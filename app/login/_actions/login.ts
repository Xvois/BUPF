"use server"

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

/*
Performs a login action using the email and password provided.
*/
export default async function login(props: { email: string; password: string }, redirectURL: string) {
    const {email, password} = props;

    const supabase = await createClient();

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?error=" + error.message);
    }

    return redirect(redirectURL);
};
