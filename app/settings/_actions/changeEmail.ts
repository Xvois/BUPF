'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

const changeEmail = async (newEmail: string) => {
	const supabase = createClient();
	const {error} = await supabase.auth.updateUser({email: newEmail});
	if (error) {
		return redirect("/settings?email_error=" + error.message);
	}
};


export default changeEmail;