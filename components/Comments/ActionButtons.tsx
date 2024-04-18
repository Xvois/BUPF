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
import React, {useEffect} from "react";
import {ServerError} from "@/components/ServerError";
import RichTextArea from "@/components/RichTextArea";
import {Checkbox} from "@/components/ui/checkbox";
import {useSearchParams} from "next/navigation";
import {useMediaQuery} from "@/hooks/use-media-query";
import {Dialog, DialogContent,} from "@/components/ui/dialog";

type ReplyButtonProps = {
  comment: Tables<"comments">;
  postID: number;
};

export const ReplyButton = (props: ReplyButtonProps & ButtonProps) => {
  const { comment, postID, ...buttonProps } = props;
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  console.log(isDesktop);

  const [open, setOpen] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState<string>("");
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (replyContent) {
      await postComment(replyContent, isAnonymous, postID, comment.id);
      setReplyContent("");
      setOpen(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const ReplyForm = () => (
    <form
      onSubmit={onSubmit}
      className={"border-l pl-4 min-w-72 w-full md:w-96"}
    >
      <RichTextArea
        className={"text-foreground min-h-16"}
        onChange={onChange}
        id={"comment-reply"}
        value={replyContent}
      />
      <div className={"inline-flex w-full"}>
        <div className="flex space-x-2 items-center text-foreground">
          <Checkbox
            name={"anonymous_comment"}
            id={"anonymous_comment"}
            checked={isAnonymous}
            onClick={() => setIsAnonymous(!isAnonymous)}
          />
          <label
            htmlFor="anonymous_comment"
            className="text-sm font-medium leading-none"
          >
            Anonymous
          </label>
        </div>
        <div className={"w-fit ml-auto"}>
          <Button variant={"link"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={"link"} type={"submit"}>
            Submit
          </Button>
        </div>
      </div>
      <ServerError>{searchParams.get("error")}</ServerError>
    </form>
  );

  if (!isDesktop)
    return (
      <div className={"h-fit w-9 space-y-4"}>
        <Button onClick={() => setOpen(true)} {...buttonProps}>
          Reply
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <ReplyForm />
          </DialogContent>
        </Dialog>
      </div>
    );

  return (
    <div className={"h-fit w-9 space-y-4"}>
      <Button onClick={() => setOpen(true)} {...buttonProps}>
        Reply
      </Button>
      {open && <ReplyForm />}
    </div>
  );
};

type MarkButtonProps = {
  isMarked: boolean;
  comment: Tables<"comments"> & { profiles: Tables<"profiles"> | null };
  postID: number;
};

export const MarkButton = (props: MarkButtonProps & ButtonProps) => {
  const { comment, postID, isMarked, ...buttonProps } = props;

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
  const { comment, postID, ...buttonProps } = props;

  const [open, setOpen] = React.useState(false);
  const [isReporting, setIsReporting] = React.useState(false);
  const [reportError, setReportError] = React.useState<string | null>(null);

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
  const { comment, postID, ...buttonProps } = props;

  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
