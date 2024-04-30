import * as React from "react";
import {createClient} from "@/utils/supabase/server";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/supabase";

export default async function UserDropdown({profile}: { profile: Tables<"profiles"> | null }) {
    const supabase = createClient();
    const {
        data: {user},
        error,
    } = await supabase.auth.getUser();
    if (!user) {
        return (
            <Button variant={"link"} asChild>
                <Link href={"/login"}>Log in</Link>
            </Button>
        );
    }

    if (!profile) return <></>;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex items-center space-x-4 ml-auto">
                    <Avatar>
                        <AvatarImage
                            src={profile.profile_picture || undefined}
                            alt={profile.first_name}
                        />
                        <AvatarFallback>
                            {profile.first_name[0]}
                            {profile.last_name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href={`/posts/${user.id}`}>My Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link href={"/signout"}>Sign out</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
