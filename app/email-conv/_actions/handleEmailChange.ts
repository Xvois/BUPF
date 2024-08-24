'use server'


import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export const handleEmailChange = async (newEmail: string) => {
    const admin = createClient();
    if (newEmail.endsWith("@bath.ac.uk")) {
        const {error} = await admin.auth.updateUser({email: newEmail});
        if (error) {
            return redirect("?email_error=" + error.message);
        } else {
            return redirect("/home");
        }
    } else {
        return redirect("?email_error=Please use a bath.ac.uk email address");
    }

}