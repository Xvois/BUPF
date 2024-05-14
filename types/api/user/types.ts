// /api/user/modules
import {Tables} from "@/types/supabase";

export type UserModulesResponse = {
	required: Tables<"modules">[],
	optional: Tables<"modules">[]
}