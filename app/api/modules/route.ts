import {applyQueryParams} from "@/utils/api/helpers";
import {ModulesResponse} from "@/types/api/modules/types";
import {createAdminClient} from "@/utils/supabase/admin";

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(request: Request) {
	const client = createAdminClient();

	const params = new URL(request.url).searchParams;

	const query = client.from("modules").select("*");

	applyQueryParams(query, params);

	const response: ModulesResponse = await query;

	return Response.json(response);
}