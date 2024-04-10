import {createClient} from "@/utils/supabase/server";


export async function GET(req: Request) {
    const supabase = createClient();

    const {
        data: {user},
        error
    } = await supabase.auth.getUser();

    if (error) {
        return Response.json({error: error.message}, {status: 500});
    }

    return Response.json({user});
}