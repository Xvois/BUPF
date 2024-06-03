"use server"


import {createClient} from "@/utils/supabase/client";

export const resendEmail = async (email: string, redirect: string) => {
	const supabase = createClient();
	const {error} = await supabase.auth.resend({
		type: 'signup',
		email: email,
		options: {
			emailRedirectTo: redirect
		}
	});

	if (error) {
		throw error;
	}
}