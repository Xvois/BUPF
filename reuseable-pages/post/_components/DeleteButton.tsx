"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";


export const DeleteButton = ({post_id}: {
    post_id: number
}) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const deletePost = async () => {
        setIsDeleting(true);
        const supabase = createClient();
        const {error} = await supabase.from("posts").delete().eq("id", post_id);
        if (error) {
            setIsDeleting(false)
        } else {
            router.push("/home")
        }
    }

    return (
        <Button isLoading={isDeleting} onClick={() => deletePost()} variant={"destructive"}>
            Delete
        </Button>
    )
}