"use client"

import {Tables} from "@/types/supabase";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * A small component that displays the profile name.
 * When hovered, it displays the profile picture and the course they are on.
 *
 * The course is fetched from the database when hovered.
 *
 * @example
 * const supabase = createClient();
 * const {data: profile} = await supabase.from("profiles").select().eq("id", user.id).single();
 * //...
 * <Profile profile={profile} />
 *
 * @param props The profile object from the "profiles" table.
 * @constructor
 */
export default function Profile(props: { profile: Tables<'profiles'> }) {
    const {profile} = props;
    const [hasBeenTriggered, setHasBeenTriggered] = useState(false);
    const [course, setCourse] = useState<Tables<'courses'> | null>(null);

    useEffect(() => {
        if (hasBeenTriggered) {
            const supabase = createClient();
            supabase.from("users_courses").select("*, details:course_years(course:courses(*))").eq("user_id", profile.id).single().then(({data, error}) => {
                if (data?.details?.course) {
                    setCourse(data.details.course);
                }
            });
        }
    }, [hasBeenTriggered]);

    if (!profile) {
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
                        variant="link">{profile.first_name} {profile.last_name}</Button>
            </HoverCardTrigger>
            <HoverCardContent className={"flex gap-4 items-center"}>
                {
                    course ?
                        <>
                            <Avatar>
                                <AvatarImage src={profile.profile_picture || undefined}/>
                                <AvatarFallback>{profile.first_name[0]}{profile.last_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{profile.first_name} {profile.last_name} <span
                                    className={"text-xs text-muted-foreground"}>{course?.type}</span></p>
                                <p className={"text-muted-foreground text-xs"}>{course?.title} {}</p>
                            </div>
                        </>
                        :
                        <LoadingSpinner />
                }
            </HoverCardContent>
        </HoverCard>
    );
}
