import {createClient} from "@/utils/supabase/server";
import ResetForm from "@/app/auth/reset/_components/reset-form";


export default async function Page() {
    const supabase = await createClient();
    const {data} = await supabase.auth.getSession();
    console.log(data);
    return <ResetForm/>
}