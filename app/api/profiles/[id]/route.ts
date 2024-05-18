import {createAdminClient} from "@/utils/supabase/admin";
import {ProfileResponse} from "@/types/api/profiles/types";

/*
 IMPORTANT:
 THIS ROUTE USES createAdminClient, MEANING RLS IS ABANDONED
 THIS IS BECAUSE PROFILES SHOULD NOT HAVE PROHIBITIVE READ RLS.

 IF YOU NEED TO USE RLS, USE createClient INSTEAD

 createAdminClient is used as it does not require cookies,
 allowing responses to be cached
 */

export async function GET(
	request: Request,
	{params}: { params: { id: string } }
) {
	const supabase = createAdminClient();

	const response: ProfileResponse = await supabase.from('profiles').select('*').eq('id', params.id).single();

	return Response.json(response);
}
