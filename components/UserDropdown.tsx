"use client"

import * as React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Tables} from "@/types/supabase";
import {User} from "@supabase/auth-js";
import {PostgrestError} from "@supabase/supabase-js";

export default function UserDropdown() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
    const [profileError, setProfileError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select()
                    .eq("id", user.id)
                    .single();
                setProfile(profile);
                setProfileError(error);
            }
        };
        fetchUser();
    }, [supabase]);

    if (!user) {
        return (
            <Button variant={"link"} asChild>
                <Link href={"/login"}>Log in</Link>
            </Button>
        );
    }

    if (!profile) {
        return <span>Error fetching profile: {profileError?.message}</span>;
    }

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
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`/posts/${user.id}`}>My Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link prefetch={false} href={"/signout"}>Sign out</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}