import * as React from "react";
import {createClient} from "@/utils/supabase/server";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";


export default async function UserDropdown() {
    const supabase = createClient();
    const {data: {user}, error} = await supabase.auth.getUser();
        if (!user) {
        return <Link href={"/login"}>Log in</Link>;
    }
    const {data, error: profileError} = await supabase.from('profiles').select().eq('id', user.id).single();



    if (!data) {
        return <span>Error fetching profile: {profileError?.message}</span>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex items-center space-x-4 ml-auto">
                    <Avatar>
                        <AvatarImage src={data.profile_picture || undefined} alt={data.first_name} />
                        <AvatarFallback>{data.first_name[0]}{data.last_name[0]}</AvatarFallback>
                    </Avatar>
                    <p className={"h-fit hidden sm:block"}>
                        {data.first_name} {data.last_name}
                    </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Subscriptions</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={'/signout'}>Sign out</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}