"use server";

import {createClient} from "@/utils/supabase/server";
import {createAdminClient} from "@/utils/supabase/admin";
import {redirect} from "next/navigation";
import {formSchema} from "@/app/settings/formSchema";
import {z} from "zod";

export const handleSubmit = async (fd: z.infer<typeof formSchema>) => {

    console.log("Hello!!")

    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return redirect("/settings?error=No user found");
    }

    if (user.email !== fd.email) {
        await changeEmail(fd.email);
    }

    const newProfile = {
        first_name: fd.firstName,
        last_name: fd.lastName,
        course: +fd.course,
        entry_date: fd.yearOfStudy ? new Date(+fd.yearOfStudy, 9, 1, 12, 0, 0, 0) : null,
    }

    const {error} = await supabase.from("profiles").update({...newProfile}).eq("id", user.id);

    if (error) {
        return redirect("/settings?error=" + error.message);
    }
}

export const deleteAccount = async () => {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();
  const {data: {user: user}} = await supabase.auth.getUser();
  if (!user) {
    return redirect("/settings?delete_error=No user found");
  }
  const {error} = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error) {
    return redirect("/settings?delete_error=" + error.message);
  }

  return redirect("/login");
}

export const changeEmail = async (newEmail: string) => {
  const supabase = createClient();
  const {error} = await supabase.auth.updateUser({email: newEmail});
  if (error) {
    return redirect("/settings?email_error=" + error.message);
  }
};

export const changePassword = async () => {
  const supabase = createClient();
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return redirect("/settings?password_error=" + userError.message);
  }
  if (!user) {
    return redirect("/settings?password_error=No user found");
  }
  if (!user.email) {
    return redirect("/settings?password_error=No email found");
  }

  const {error} = await supabase.auth.resetPasswordForEmail(user.email);

  if (error) {
    return redirect("/settings?password_error=" + error.message);
  }
};
