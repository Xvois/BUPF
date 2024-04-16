'use client'

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {SendHorizonal} from "lucide-react";
import React from "react";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import {changeEmail} from "@/app/settings/actions";

export const ChangeEmailButton = () => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false)

    const performAction = async () => {
        const newEmail = (document.getElementById("new_email") as HTMLInputElement).value
        setIsLoading(true);
        await changeEmail(newEmail);
        setIsLoading(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"}>Change email</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change your email</DialogTitle>
                    <DialogDescription>
                        You can change your email address here. We will send a confirmation email to your new
                        address.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="new_email" className="sr-only">
                            New email
                        </Label>
                        <Input
                            id="new_email"
                            type={"email"}
                        />
                    </div>
                    <Button isLoading={isLoading} onClick={performAction} type="submit" size="sm" className="px-3">
                        <span className="sr-only">Change email</span>
                        <SendHorizonal className="h-4 w-4"/>
                    </Button>
                </div>
                <DialogFooter>
                    <ServerError>
                        {searchParams.has("email_error") ? searchParams.get("email_error") : null}
                    </ServerError>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}