import {Tables} from "@/types/supabase";
import {Separator} from "@/components/ui/separator";
import Profile from "@/components/Profile";
import {createClient} from "@/utils/supabase/server";
import {CommendButton} from "@/reuseable-pages/combo-display/_components/UsefulResources/CommendButton";
import {DeleteResourceButton} from "@/reuseable-pages/combo-display/_components/UsefulResources/DeleteResourceButton";
import ExtLink from "@/components/ExtLink";


export default async function Resource({resource}: {
    resource: Tables<"resources"> & { owner: Tables<"profiles"> }
}) {

    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    const {count: hasCommended} = user ? await supabase.from("resource_commendations").select("*", {
        head: true,
        count: "exact"
    }).eq("resource", resource.id).eq("commender", user.id) : {count: null};
    const {count: commendations} = await supabase.from("resource_commendations").select("*", {
        head: true,
        count: "exact"
    }).eq("resource", resource.id);

    return (
        <div className="min-w-96 flex-grow p-4 space-y-2 rounded-md border">
            <div>
                <p className="font-semibold">{resource.title}</p>
                <p>{resource.description}</p>
                {resource.url && <p className={"text-muted-foreground"}>Available at: <ExtLink href={resource.url}>{resource.url}</ExtLink></p>}
            </div>
            <Separator/>
            <div className={"flex flex-row gap-4 items-center justify-between"}>
                <div className={"text-muted-foreground"}>
                    by <Profile profile={resource.owner}/>
                </div>
                <div className={"inline-flex gap-2"}>
                    {
                        commendations !== null && <CommendButton resourceID={resource.id} commendations={commendations}
                                                                 isOwner={user?.id === resource.owner.id}
                                                                 hasCommended={hasCommended === null ? null : !!hasCommended}
                                                                 isLoggedIn={!!user}/>
                    }
                    {
                        user?.id === resource.owner.id && <DeleteResourceButton resourceID={resource.id}/>
                    }
                </div>

            </div>
        </div>
    )
}