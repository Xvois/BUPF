import {isQueryFilters, operatorHandlers} from "@/utils/api/helpers";
import {PostgrestOperators} from "@/types/api/options";
import {ModulesResponse} from "@/types/api/modules/types";
import {createAdminClient} from "@/utils/supabase/admin";

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET(request: Request) {
	const client = createAdminClient();

	const params = new URL(request.url).searchParams;

	let query = client.from("modules").select("*");

	const filtersString = params.get("filters");
	if (filtersString) {
		const filters = JSON.parse(filtersString);
		filters.forEach((filter: any) => {
			if (isQueryFilters(filters)) {
				const handler = operatorHandlers[filter.operator as PostgrestOperators];
				if (handler) {
					// Use the corresponding handler to format the value
					filter.value = handler(filter.value);
				}
				query.filter(filter.column, filter.operator, filter.value);
			} else {
				// Handle the case where the filters are not in the expected format
				return Response.json({error: "Invalid filters format."});
			}

		});
	}

	const sort = params.get("sort");
	if (sort) {
		const JSONSort = JSON.parse(sort);
		query = query.order("created_at", JSONSort);
	}

	const response: ModulesResponse = await query;

	return Response.json(response);
}