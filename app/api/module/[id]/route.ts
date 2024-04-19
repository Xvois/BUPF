import {createClient} from "@/utils/supabase/server";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const supabase = createClient();

    const { data, error } = await supabase.from('modules').select('*').eq('id', params.id).single()

    if(error) {
        return Response.json({error: error.message}, {status: 500});
    }

    return Response.json(data);
}
