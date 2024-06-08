import {createAdminClient} from "@/utils/supabase/admin";
import {toPostgresList} from "@/utils/api/helpers";
import {DraftsResponse} from "@/types/api/drafts/types";


export async function GET(request: Request) {
	const client = createAdminClient();

	const params = new URL(request.url).searchParams;

	let query = client.from("drafts").select("*");

	const filtersString = params.get("filters");
	if (filtersString) {
		const filters = JSON.parse(filtersString);
		filters.forEach((filter: any) => {
			if (Array.isArray(filter.value)) {
				filter.value = toPostgresList(filter.value);
			}
			query.filter(filter.column, filter.operator, filter.value);
		});
	}

	const sort = params.get("sort");
	if (sort) {
		const JSONSort = JSON.parse(sort);
		query = query.order("created_at", JSONSort);
	}

	const response: DraftsResponse = await query;

	return Response.json(response);
}