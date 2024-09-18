import LinkBox from "@/components/LinkBox";
import InfoBox from "@/components/InfoBox";
import {Database} from "@/types/supabase";
import PostsIndicator from "@/app/modules/_components/PostsIndicator";


export function CoreModules({modules}: {
    modules: Database["public"]["Functions"]["get_user_module_assignments"]["Returns"]
}) {

    return (
        <div className={"flex flex-wrap gap-4"}>
            {
                modules.length > 0 ? modules.map(module => (
                        <LinkBox
                            key={module.module_id}
                            title={`${module.module_title} / ${module.module_id?.toUpperCase()}`}
                            href={`/modules/${module.module_id}`}
                            className={"max-w-screen-sm flex-grow"}
                            description={module.module_description || undefined}
                        >
                            <PostsIndicator moduleID={module.module_id}/>
                        </LinkBox>
                    ))
                    :
                    <InfoBox title={"No required modules available."}>
                        Think this is a mistake? Contact a site admin.
                    </InfoBox>
            }
        </div>
    )
}