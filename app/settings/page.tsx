import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import SettingsForm from "@/app/settings/settings-form";

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();


  if (!profile) {
    return redirect("/login");
  }


  return (
      <SettingsForm user={user} profile={profile}/>
  );
}