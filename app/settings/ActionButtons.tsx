'use client'

import {Button, ButtonProps} from "@/components/ui/button";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import {deleteAccount} from "@/app/settings/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Fragment, useEffect, useState} from "react";

export const DeleteAccountButton = (props: ButtonProps) => {
    const searchParams = useSearchParams();
    const [alertIsOpen, setAlertIsOpen] = useState(false);

    const performAction = async () => {
        await deleteAccount();
    }

    useEffect(() => {
        if (searchParams.has("delete_error")) {
            setAlertIsOpen(true);
        }
    }, [searchParams]);

    return (
        <Fragment>
            <AlertDialog open={alertIsOpen} onOpenChange={(e) => setAlertIsOpen(e)}>
                <AlertDialogTrigger>
                    <Button {...props}>
                        Delete account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete account</AlertDialogTitle>
                    </AlertDialogHeader>
                    {
                        searchParams.has("password_error") ? (
                                <ServerError className="w-full">
                                    {searchParams.get("delete_error")}
                                </ServerError>
                            ) :
                            <AlertDialogDescription>
                                Are you sure you want to delete your account? This action is irreversible.
                            </AlertDialogDescription>
                    }
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={performAction}>Understood</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Fragment>

    )
}