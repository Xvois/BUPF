'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

const changeEmail = async (newEmail: string) => {
	const supabase = await createClient();
	if(newEmail.endsWith("@bath.ac.uk")) {
		const {error} = await supabase.auth.updateUser({email: newEmail});
		if (error) {
			return redirect("/settings?email_error=" + error.message);
		}
	} else {
		return redirect("/settings?email_error=Please use a bath.ac.uk email address");
	}
};


export default changeEmail;