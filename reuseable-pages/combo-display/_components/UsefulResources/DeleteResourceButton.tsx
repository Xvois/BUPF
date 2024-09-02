"use client";
import {deleteResource} from "@/reuseable-pages/combo-display/_actions/deleteResource";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useState} from "react";


export const DeleteResourceButton = ({resourceID}: { resourceID: string }) => {
    const [alertIsOpen, setAlertIsOpen] = useState(false);

    return (
        <AlertDialog open={alertIsOpen} onOpenChange={(e) => setAlertIsOpen(e)}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={"destructive"}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete resource</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to delete your resource? This action is irreversible.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteResource(resourceID).then(
                            // No action needed, alert action dialog
                            // auto closes here
                        );
                    }}>Understood</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}