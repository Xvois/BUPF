'use server'

import {createClient} from "@/utils/supabase/server";
import {createAdminClient} from "@/utils/supabase/admin";
import {redirect} from "next/navigation";

const deleteAccount = async () => {
	const supabase = createClient();
	const supabaseAdmin = createAdminClient();
	const {data: {user: user}} = await supabase.auth.getUser();
	if (!user) {
		return redirect("/settings?delete_error=No user found");
	}
	const {error} = await supabaseAdmin.auth.admin.deleteUser(user.id);
	console.log(error)
	if (error) {
		return redirect("/settings?delete_error=" + error.message);
	}

	return redirect("/login");
}
export default deleteAccount;