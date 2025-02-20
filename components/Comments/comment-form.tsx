"use client"


import {ChangeEvent, FormEvent, useState} from 'react';
import {Button} from "@/components/ui/button";
import RichTextArea from "@/components/RichTextArea";
import {postComment} from "@/components/Comments/actions";
import {ServerError} from "@/components/ServerError";
import {useSearchParams} from "next/navigation";
import AnonymousButton from "@/components/AnonymousButton";

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
        <form className={"flex flex-col gap-4"} onSubmit={onSubmit}>

            <RichTextArea className={"min-h-20 md:min-h-28 lg:min-h-36"} id={"comment"} placeholder={"Write a comment..."} value={comment}
                          onChange={onChange}/>
            <div className={"flex flex-col md:flex-row gap-4 items-center"}>
                <Button variant={"default"} type="submit">Submit</Button>
                <AnonymousButton state={isAnonymous} dispatch={setIsAnonymous} />
            </div>
            <ServerError>
                {searchParams.get("error")}
            </ServerError>
        </form>
    )
}