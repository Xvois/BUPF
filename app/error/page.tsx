import {XCircle} from "lucide-react";

export default function Success({
                                    searchParams,
                                }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const message = searchParams["message"];

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