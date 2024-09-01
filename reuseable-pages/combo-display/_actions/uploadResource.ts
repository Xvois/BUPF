"use server"

import {resourceSchema} from "@/reuseable-pages/combo-display/_schema/resourceSchema";
import {z} from "zod";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";


export const uploadResource = async (resource: z.infer<typeof resourceSchema>, module_id: string) => {
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if(!user) {
        throw new Error("User is not authenticated");
    }

    // Upload resource to the database
    const {data: resourceRow, error: resourceError} = await supabase.from("resources").insert({...resource, owner: user?.id}).select("id").single();

    if(resourceError) {
		throw new Error(`Failed to add resource: ${resourceError.message}`);
    }

    // Upload the relationship between the resource and the module
    const {error: moduleResourceError} = await supabase.from("module_resources").insert({
        module: module_id,
        resource: resourceRow.id
    });

    if(moduleResourceError) {
        throw new Error(`Failed to add resource to module: ${moduleResourceError.message}`);
    }

    revalidatePath("/", "page");
}