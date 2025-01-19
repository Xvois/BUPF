"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import {updateCommendations} from "@/app/modules/[module_id]/_actions/updateCommendations";

export const CommendButton = ({ resourceID, commendations, isLoggedIn, isOwner, hasCommended }: {
    resourceID: string,
    commendations: number,
    isLoggedIn: boolean,
    isOwner: boolean,
    hasCommended: boolean | null
}) => {
    // Local state to manage the optimistic UI updates
    const [localCommendations, setLocalCommendations] = useState(commendations);
    const [userHasCommended, setUserHasCommended] = useState(hasCommended);

    const handleCommendationClick = async () => {
        if (isLoggedIn && !isOwner) {
            // Optimistically update commendations
            const newCommendationCount = userHasCommended ? localCommendations - 1 : localCommendations + 1;
            setLocalCommendations(newCommendationCount);

            // Optimistically toggle user's commendation status
            setUserHasCommended(!userHasCommended);

            try {
                // Perform the server-side update
                await updateCommendations(resourceID);
            } catch (error) {
                // If there's an error, revert the optimistic updates
                setLocalCommendations(localCommendations);
                setUserHasCommended(userHasCommended);
                console.error("Failed to update commendations:", error);
            }
        }
    };

    return (
        <Button
            className={"flex items-center space-x-2"}
            variant={"ghost"}
            disabled={isOwner}
            onClick={handleCommendationClick}>
            <ChevronUp className={"h-4 w-4"} />
            <p>{localCommendations}</p>
        </Button>
    );
}
