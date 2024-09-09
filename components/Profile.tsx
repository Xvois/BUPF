"use client"

import {Tables} from "@/types/supabase";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Profile(props: { user: Tables<'profiles'> }) {
    const {user} = props;
    const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
    const [course, setCourse] = useState<Tables<'courses'> | null>(null);

    useEffect(() => {
        if (hasBeenTriggered) {
            const supabase = createClient();
            supabase.from("users_courses").select("*, details:course_years(course:courses(*))").eq("user_id", user.id).single().then(({data, error}) => {
                if (data?.details?.course) {
                    console.log(data);
                    setCourse(data.details.course);
                }
            });
        }
    }, [hasBeenTriggered]);

    if (!user) {
        return <span>Deleted user</span>; // or some fallback UI
    }

    return (
        <HoverCard onOpenChange={() => {
            if (!hasBeenTriggered) {
                setHasBeenTriggered(true);
            }
        }}>
            <HoverCardTrigger asChild>
                <Button className={"p-0 h-fit w-fit font-normal text-md"}
                        variant="link">{user.first_name} {user.last_name}</Button>
            </HoverCardTrigger>
            <HoverCardContent className={"flex gap-4 items-center"}>
                {
                    course ?
                        <>
                            <Avatar>
                                <AvatarImage src={user.profile_picture || undefined}/>
                                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{user.first_name} {user.last_name} <span
                                    className={"text-xs text-muted-foreground"}>{course?.type}</span></p>
                                <p className={"text-muted-foreground text-xs"}>{course?.title}</p>
                            </div>
                        </>
                        :
                        <LoadingSpinner />
                }
            </HoverCardContent>
        </HoverCard>
    );
}
