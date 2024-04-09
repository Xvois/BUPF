import {Tables} from "@/types/supabase";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";

export default function Profile(props: { user: Tables<'profiles'> | null }) {
    const {user} = props;

    if (!user) {
        return <span>Deleted user</span>; // or some fallback UI
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button className={"p-0 h-fit"}
                        variant="link">{user.first_name} {user.last_name}</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className={"inline-flex flex-row leading-none my-auto align-middle"}>
                    <Avatar>
                        <AvatarImage src={user.profile_picture || undefined}/>
                        <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.first_name} {user.last_name}</span>
                </div>
                <p className={"text-sm text-muted-foreground"}>{user.course}</p>
            </HoverCardContent>
        </HoverCard>
    );
}