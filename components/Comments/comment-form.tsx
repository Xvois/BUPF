"use client"


import {ChangeEvent, FormEvent, useState} from 'react';
import {Button} from "@/components/ui/button";
import RichTextArea from "@/components/RichTextArea";
import {postComment} from "@/components/Comments/actions";
import {ServerError} from "@/components/ServerError";
import {Checkbox} from "@/components/ui/checkbox";
import {useSearchParams} from "next/navigation";

export default function CommentForm({postID}: { postID: number }) {
    const searchParams = useSearchParams();

    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comment) {
            await postComment(comment, isAnonymous, postID);
            setComment(''); // clear the text area after submitting
        }
    }

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }

    return (
        <form className={"flex flex-col gap-2"} onSubmit={onSubmit}>
            <RichTextArea className={"min-h-20"} id={"comment"} placeholder={"Write a comment..."} value={comment}
                          onChange={onChange}/>
            <div className={"flex flex-row justify-between"}>
                <div className="items-top flex space-x-2">
                    <Checkbox
                        name={"anonymous"}
                        id={"anonymous"}
                        checked={isAnonymous}
                        onClick={() => setIsAnonymous(!isAnonymous)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="anonymous"
                            className="text-sm font-medium leading-none"
                        >
                            Anonymous
                        </label>
                        <p className="text-sm text-muted-foreground">
                            Your comment will be posted anonymously.
                        </p>
                    </div>
                </div>
                <Button className={"w-fit"} variant={"secondary"} type="submit">Submit</Button>
            </div>
            <ServerError>
                {searchParams.get("error")}
            </ServerError>
        </form>
    )
}