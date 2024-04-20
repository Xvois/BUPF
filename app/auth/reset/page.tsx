import {createClient} from "@/utils/supabase/server";
import ResetForm from "@/app/auth/reset/reset-form";


export default async function Page() {
    const supabase = createClient();
    const {data} = await supabase.auth.getSession();
    console.log(data);
    return <ResetForm/>
}