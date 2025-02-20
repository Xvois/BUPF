import Profile from "@/components/Profile";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {DeleteButton, MarkButton, ReplyButton, ReportButton,} from "@/components/Comments/ActionButtons";
import {CircleCheck} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {CommentType} from "@/components/Comments/CommentSection";
import {User} from "@supabase/auth-js";

export default function Comment({
  comment,
  user,
  postID,
  isDeletable = false,
  isReportable = false,
  isMarkable = false,
  isMarked = false,
}: {
  comment: CommentType;
  user: User;
  postID: string;
  isDeletable?: boolean;
  isReportable?: boolean;
  isMarkable?: boolean;
  isMarked?: boolean;
}) {
  return (
    <>
      <div className={"max-w-screen-lg"}>
        {comment.anonymous || !comment.profiles ? (
          <p className={"text-sm"}>Anonymous</p>
        ) : (
          <Profile profile={comment.profiles} />
        )}
		  <MarkdownRender>{comment.content}</MarkdownRender>
        <div
          className={`inline-flex gap-4 text-sm items-start text-muted-foreground`}
        >
          <ReplyButton
            comment={comment}
            postID={+postID}
            className={"p-0 h-fit hover:bg-background"}
            variant={"ghost"}
          >
            Reply
          </ReplyButton>
          {isReportable && (
            <ReportButton
              comment={comment}
              postID={+postID}
              className={"p-0 h-fit hover:bg-background"}
              variant={"ghost"}
            >
              Report
            </ReportButton>
          )}
          {isDeletable && (
            <DeleteButton
              comment={comment}
              postID={+postID}
              className={"p-0 h-fit hover:bg-background"}
              variant={"ghost"}
            >
              Delete
            </DeleteButton>
          )}
          {isMarkable && (
            <MarkButton
              className={"p-0 h-fit hover:bg-background"}
              variant={"ghost"}
              isMarked={isMarked}
              comment={comment}
              postID={+postID}
            />
          )}
          {isMarked && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <CircleCheck className={"h-5 w-5 text-green-600/90"} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This thread is the author&apos;s selected answer.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {comment.children.map((child) => (
        <div className={"pl-4 mt-2 border-l"} key={child.id}>
          <Comment
            isDeletable={user ? user.id === comment.owner : false}
            isReportable={user && user.id !== comment.owner}
            key={child.id}
            comment={child}
            user={user}
            postID={postID}
          />
        </div>
      ))}
    </>
  );
}
