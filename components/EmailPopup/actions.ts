'use server'


import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export const handleEmailChange = async (newEmail: string) => {
	const admin = createClient();
	const {error} = await admin.auth.updateUser({email: newEmail});
	if (error) {
		return redirect("?email_error=" + error.message);
	}
}