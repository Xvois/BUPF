import {XCircle} from "lucide-react";

// @ts-expect-error Unknown types for dynamic APIs change with NEXT 15
export default async function Success({searchParams}) {
    const {message} = await searchParams;

    if (message) {
        return (
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md px-6 py-8 border shadow-md rounded-lg text-center">
                <XCircle className="mx-auto text-foreground h-8 w-8"/>
                <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
        );
    }

    return null;
}