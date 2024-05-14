import {createAdminClient} from "@/utils/supabase/admin";
import {ModuleResponse} from "@/types/api/modules/types";

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

	const response: ModuleResponse = await supabase.from('modules').select('*').eq('id', params.id).single()

	return Response.json(response);
}
