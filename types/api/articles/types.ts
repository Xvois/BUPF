import {Tables} from "@/types/supabase";
import {PostgrestResponse} from "@supabase/supabase-js";


export type ArticlesResponse = PostgrestResponse<Tables<"posts"> & {
	profiles: Tables<"profiles"> | null
}>