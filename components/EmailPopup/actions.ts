'use server'


import {createAdminClient} from "@/utils/supabase/admin";
import {redirect} from "next/navigation";

export const handleEmailChange = async (newEmail: string) => {
	const admin = createAdminClient();
	const {error} = await admin.auth.updateUser({email: newEmail});
	if (error) {
		return redirect("/settings?email_error=" + error.message);
	}
}