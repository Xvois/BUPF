import {createAdminClient} from "@/utils/supabase/admin";

/*
IMPORTANT:
THIS ROUTE USES createAdminClient, MEANING RLS IS ABANDONED
THIS IS BECAUSE MODULES SHOULD NOT HAVE PROHIBITIVE READ RLS.

IF YOU NEED TO USE RLS, USE createClient INSTEAD

createAdminClient is used as it does not require cookies,
allowing responses to be cached
 */

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    const supabase = createAdminClient();

    const {data, error} = await supabase.from('modules').select('*').eq('id', params.id).single()

    if (error) {
        return Response.json({error: error.message}, {status: 500});
    }

    return Response.json(data);
}
