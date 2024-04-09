import LoadingSpinner from "@/components/LoadingSpinner";


export default function Loading() {
    return (
        <div>
            <LoadingSpinner className={"absolute inset-0 m-auto scale-150"} />
        </div>
    )
}