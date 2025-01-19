import { Button } from "@/components/ui/button";
import { User, VenetianMask } from "lucide-react";
import React from "react";

export default function AnonymousButton({ state, dispatch }: { state: boolean, dispatch: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Button type={"button"} className={"w-36 transition-colors"} onClick={() => dispatch(e => {return !e;})}>
            {state
                ? <p className={"inline-flex gap-2 items-center"}><VenetianMask /> Anonymous</p>
                : <p className={"inline-flex gap-2 items-center"}><User /> Public</p>
            }
        </Button>
    );
}