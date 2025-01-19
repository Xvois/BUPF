import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";

/*
This is page is used to ensure a token isn't used up in email
URL prefetching.
 */

/*
type ExpectedParams = {
    redirect?: string,
    token_hash?: string,
    type?: "signup"
}
 */

// @ts-expect-error Unknown types for dynamic APIs change with NEXT 15, see above type for expected params
export default async function Page({searchParams}) {
    const {redirect, token_hash, type} = await searchParams;
    const isValid = redirect && token_hash && (type === "signup");
    if (!isValid) {
        return <div>Invalid request</div>
    }
    return (
        <div className={"p-6 w-full space-y-4"}>
            <div>
                <p className={"font-bold"}>BUPF</p>
                <h1 className={"text-4xl font-black"}>Confirm your email</h1>
            </div>
            <Separator/>
            <div>
                <p className={"text-sm text-muted-foreground"}>Click the button below to confirm your email address.</p>
            </div>
            <Button asChild>
                <Link href={searchParams.redirect + `?token_hash=${searchParams.token_hash}&type=${searchParams.type}`}>
                    Confirm Email
                </Link>
            </Button>
        </div>
    )
}