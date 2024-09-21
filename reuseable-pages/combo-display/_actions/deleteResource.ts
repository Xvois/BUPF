"use server";


import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export const deleteResource = async (resourceID: string) => {
    console.log("Deleting resource with ID: " + resourceID);
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    // Delete the resource
    const {error: resourceError} = await supabase.from("resources").delete().eq("id", resourceID);

    if (resourceError) {
        throw new Error(`Failed to delete resource: ${resourceError.message}`);
    }

    revalidatePath("/", "page");
}