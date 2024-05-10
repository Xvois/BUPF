import {createAdminClient} from "@/utils/supabase/admin";

/*
IMPORTANT:
THIS ROUTE USES createAdminClient, MEANING RLS IS ABANDONED
THIS IS BECAUSE COURSES SHOULD NOT HAVE PROHIBITIVE READ RLS.

IF YOU NEED TO USE RLS, USE createClient INSTEAD

createAdminClient is used as it does not require cookies,
allowing responses to be cached
 */

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    const supabase = createAdminClient();

    const {data, error} = await supabase.from('courses').select('*').eq('id', params.id).single()

    if (error) {
        return Response.json({data: null, error: error}, {status: 200});
    }

    return Response.json({data, error});
}
