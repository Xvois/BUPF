"use client";
/*
Client buttons that invoke server actions in the Comment component.
 */

import {Button, ButtonProps} from "@/components/ui/button";
import {Tables} from "@/types/supabase";
import {deleteComment, markComment, postComment, reportComment, unMarkComment,} from "@/components/Comments/actions";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {FormEvent, useEffect, useState} from "react";
import {ServerError} from "@/components/ServerError";
import RichTextArea from "@/components/RichTextArea";
import {Checkbox} from "@/components/ui/checkbox";
import {useSearchParams} from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

type ReplyButtonProps = {
    comment: Tables<"comments">
    postID: number;
};

export const ReplyButton = (props: ReplyButtonProps & ButtonProps) => {
    const {comment, postID, ...buttonProps} = props;
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reply, setReply] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (reply) {
            setIsSubmitting(true);
            await postComment(reply, isAnonymous, postID, comment.id);
            setIsSubmitting(false);
            setReply("");
            setOpen(false);
        }
    };

    useEffect(() => {
        setIsSubmitting(false);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button {...buttonProps}>Reply</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reply to comment
                    </DialogTitle>
                    <DialogDescription>
                        "{comment.content}"
                    </DialogDescription>
                </DialogHeader>
                <form className={"flex flex-col gap-2"} onSubmit={onSubmit}>
                    <RichTextArea
                        className={"min-h-20"}
                        id={"comment"}
                        placeholder={"Write a reply..."}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <div className={"flex flex-row justify-between"}>
                        <div className="items-top flex space-x-2">
                            <Checkbox
                                name={"anonymous"}
                                id={"anonymous"}
                                checked={isAnonymous}
                                onClick={() => {
                                    setIsAnonymous((state) => !state);
                                }}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="anonymous"
                                    className="text-sm font-medium leading-none"
                                >
                                    Anonymous
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Your reply will be posted anonymously.
                                </p>
                            </div>
                        </div>
                        <Button
                            className={"w-fit"}
                            variant={"secondary"}
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Submit
                        </Button>
                    </div>
                    <ServerError>
                        {searchParams.get("error")}
                    </ServerError>
                </form>
            </DialogContent>
        </Dialog>
    );
};

type MarkButtonProps = {
    isMarked: boolean;
    comment: Tables<"comments"> & { profiles: Tables<"profiles"> | null };
    postID: number;
};

export const MarkButton = (props: MarkButtonProps & ButtonProps) => {
    const {comment, postID, isMarked, ...buttonProps} = props;

    return (
        <Button
            {...buttonProps}
            onClick={
                isMarked
                    ? () => unMarkComment(comment, postID)
                    : () => markComment(comment, postID)
            }
        >
            {isMarked ? "Unmark as answer" : "Mark as answer"}
        </Button>
    );
};

type ReportButtonProps = {
    comment: Tables<"comments">;
    postID: number;
};

export const ReportButton = (props: ReportButtonProps & ButtonProps) => {
    const {comment, ...buttonProps} = props;

    const [open, setOpen] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);

    const onClick = () => {
        setIsReporting(true);
        reportComment(comment)
            .then(() => {
                setOpen(false);
                setIsReporting(false);
            })
            .catch((e) => {
                setReportError(e.message);
                setIsReporting(false);
            });
    };

    useEffect(() => {
        setIsReporting(false);
        setReportError(null);
    }, [open]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button {...buttonProps}>Report</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Reports are taken seriously and are not reversible. You should only
                        report comments that are actively harmful or spam, comments being
                        incorrect is not a valid reason.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={"sm:space-y-0 space-y-2"}>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant={"destructive"}
                        onClick={onClick}
                        disabled={isReporting}
                    >
                        Report
                    </Button>
                </AlertDialogFooter>

                {reportError && (
                    <ServerError>
                        <p>{reportError}</p>
                    </ServerError>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};

type DeleteButtonProps = {
    comment: Tables<"comments">;
    postID: number;
};

export const DeleteButton = (props: DeleteButtonProps & ButtonProps) => {
    const searchParams = useSearchParams();
    const {comment, postID, ...buttonProps} = props;

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onClick = () => {
        setIsDeleting(true);
        deleteComment(comment.id, postID)
            .then(() => {
                setOpen(false);
                setIsDeleting(false);
            })
            .catch(() => {
                setIsDeleting(false);
            });
    };

    useEffect(() => {
        setIsDeleting(false);
    }, [open]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button {...buttonProps}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible and will remove the comment from the
                        post, unless it has replies. In that case, the comment will be
                        anonymised.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={"sm:space-y-0 space-y-2"}>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant={"destructive"}
                        onClick={onClick}
                        isLoading={isDeleting}
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>

                <ServerError>{searchParams.get("error")}</ServerError>
            </AlertDialogContent>
        </AlertDialog>
    );
};
