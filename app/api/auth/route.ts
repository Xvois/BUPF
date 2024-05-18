import {createClient} from "@/utils/supabase/server";

/*
This is a server route that returns the current user.
 Using a supabase client is preferred over this route.
*/


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
