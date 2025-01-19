"use server"

import {createClient} from "@/utils/supabase/server";

/**
 * Updates the commendations for a resource, inverses the commendation if the user has already commended the resource
 * @param resourceID
 */
export async function updateCommendations(resourceID: string) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) {
        throw new Error("User is not authenticated");
    }

    const {data: isResourceOwner} = await supabase.from("resources").select("owner").eq("id", resourceID).eq("owner", user.id).single();


    if(isResourceOwner) {
        throw new Error("Resource owner cannot commend their own resource");
    }

    const {count: hasCommended} = await supabase.from("resource_commendations").select("*", {head: true, count: 'exact'}).eq("resource", resourceID).eq("commender", user.id);

    if(hasCommended) {
        const {error: deleteError} = await supabase.from("resource_commendations").delete().eq("resource", resourceID).eq("commender", user.id);
        if(deleteError) {
           throw new Error("Failed to delete commendation: " + deleteError.message);
        }
    } else {
        const {error: insertError} = await supabase.from("resource_commendations").insert({resource: resourceID, commender: user.id});
        if(insertError) {
            throw new Error("Failed to insert commendation: " + insertError.message);
        }
    }

}