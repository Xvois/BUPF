import {createAdminClient} from "@/utils/supabase/admin";
import {unwrapAndApplyQParams} from "@/utils/api/helpers";
import {DraftsResponse} from "@/types/api/drafts/types";


export async function GET(request: Request) {
    const client = createAdminClient();

    const params = new URL(request.url).searchParams;

    const query = client.from("drafts").select("*");

    try {
        unwrapAndApplyQParams(query, params);
        const response: DraftsResponse = await query;
        return Response.json(response);
    } catch (e) {
        return Response.json({error: e}, {status: 400});
    }
}