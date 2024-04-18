'use client'

import {Button, ButtonProps} from "@/components/ui/button";
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
import {changeEmail, changePassword, deleteAccount} from "@/app/settings/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export const DeleteAccountButton = (props: ButtonProps) => {
    const searchParams = useSearchParams();

    const performAction = async () => {
        await deleteAccount();
    }

    return (
        <React.Fragment>
            <Button {...props} onClick={performAction}>
                Delete account
            </Button>
            <ServerError>
                {searchParams.has("delete_error") ? searchParams.get("delete_error") : null}
            </ServerError>
        </React.Fragment>

    )
}

export const ResetPasswordButton = (props: ButtonProps) => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [alertIsOpen, setAlertIsOpen] = React.useState(false);

    const performAction = async () => {
        setIsLoading(true);
        await changePassword();
        setIsLoading(false);
        setAlertIsOpen(true);
    }

    React.useEffect(() => {
        if (searchParams.has("password_error")) {
            setAlertIsOpen(true);
        }
    }, [searchParams]);

    return (
        <React.Fragment>
            <AlertDialog open={alertIsOpen} onOpenChange={(e) => setAlertIsOpen(e)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Password reset</AlertDialogTitle>
                    </AlertDialogHeader>
                    {
                        searchParams.has("password_error") ? (
                                <ServerError className="w-full">
                                    {searchParams.get("password_error")}
                                </ServerError>
                            ) :
                            <AlertDialogDescription>
                                We have sent you an email with a link to reset your password.
                            </AlertDialogDescription>
                    }
                    <AlertDialogFooter>
                        <AlertDialogAction>Understood</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button {...props} isLoading={isLoading} onClick={performAction}>
                Reset password
            </Button>
        </React.Fragment>

    )
}

export const ChangeEmailButton = (props: ButtonProps) => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const performAction = async () => {
        const newEmail = (document.getElementById("new_email") as HTMLInputElement).value
        setIsLoading(true);
        await changeEmail(newEmail);
        setIsLoading(false);
        setIsOpen(false);
    }

    React.useEffect(() => {
        if (searchParams.has("email_error")) {
            setIsOpen(true);
        }
    }, [searchParams]);

    return (
        <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
            <DialogTrigger asChild>
                <Button {...props}>Change email</Button>
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
                    <ServerError className="w-full">
                        {searchParams.has("email_error") ? searchParams.get("email_error") : null}
                    </ServerError>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
