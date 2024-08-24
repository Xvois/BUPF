"use server";

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {formSchema} from "@/app/settings/_schema/formSchema";
import {z} from "zod";
import changeEmail from "@/app/settings/_actions/changeEmail";

export const handleSubmit = async (fd: z.infer<typeof formSchema>) => {

	const supabase = createClient();
	const {data: {user}} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/settings?error=No user found");
	}

	if (user.email !== fd.email) {
		await changeEmail(fd.email);
	}

	type Profile = {
		first_name: string;
		last_name: string;
		course: number;
		entry_date: Date | null;
		profile_picture?: string;
	};

	const newProfile: Profile = {
		first_name: fd.firstName,
		last_name: fd.lastName,
		course: +fd.course,
		entry_date: fd.yearOfStudy ? new Date(+fd.yearOfStudy, 9, 1, 12, 0, 0, 0) : null,
	}

	if (fd.profilePicture) {
		newProfile["profile_picture"] = fd.profilePicture;
	}

	const {error} = await supabase.from("profiles").update({...newProfile}).eq("id", user.id);

	if (error) {
		return redirect("/settings?error=" + error.message);
	}
}