import {applyQueryParams} from "@/utils/api/helpers";
import {createAdminClient} from "@/utils/supabase/admin";
import {TopicsResponse} from "@/types/api/topics/types";

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(request: Request) {
	const client = createAdminClient();

	const params = new URL(request.url).searchParams;

	const query = client.from("topics").select("*");

	applyQueryParams(query, params);

	const response: TopicsResponse = await query;

	return Response.json(response);
}