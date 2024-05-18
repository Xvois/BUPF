// /api/user/modules
import {Tables} from "@/types/supabase";
import {PostgrestSingleResponse} from "@supabase/supabase-js";

export type UserModulesResponse = PostgrestSingleResponse<{
	required: Tables<"modules">[],
	optional: Tables<"modules">[]
}>