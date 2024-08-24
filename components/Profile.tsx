import {Tables} from "@/types/supabase";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";

export default function Profile(props: { user: Tables<'profiles'> & { courses: Tables<'courses'> | null } | null }) {
    const {user} = props;

    if (!user) {
        return <span>Deleted user</span>; // or some fallback UI
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button className={"p-0 h-fit w-fit font-normal text-md"}
                        variant="link">{user.first_name} {user.last_name}</Button>
            </HoverCardTrigger>
            <HoverCardContent className={"flex gap-4 items-center"}>
                <Avatar>
                    <AvatarImage src={user.profile_picture || undefined}/>
                    <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p>{user.first_name} {user.last_name} <span
                        className={"text-xs text-muted-foreground"}>{user.courses?.type}</span></p>
                    <p className={"text-muted-foreground text-xs"}>{user.courses ? user.courses.title : "No course"}</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
