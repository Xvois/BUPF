'use client'

import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Skeleton} from "@/components/ui/skeleton";
import Post from "@/components/Post";
import {Tables} from "@/types/supabase";
import React from "react";
import {ServerError} from "@/components/ServerError";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";


const QuestionsDisplay = (props: { target: string, tags: { key: string, value: string }[] }) => {

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [displayScrollHelper, setDisplayScrollHelper] = React.useState(true);

    React.useEffect(() => {
        let lastScrollTop = 0; // Initialize a variable to store the last scroll position

        const handleScroll = () => {
            if (scrollRef.current) {
                const {scrollTop, clientHeight, scrollHeight} = scrollRef.current;

                if (scrollTop + clientHeight >= scrollHeight - 50) {
                    setDisplayScrollHelper(false);
                } else if (scrollTop < lastScrollTop && !displayScrollHelper) {
                    // If the current scroll position is greater than the last one and displayScrollHelper is false, set it to true
                    setDisplayScrollHelper(true);
                }

                // Update the last scroll position
                lastScrollTop = scrollTop;
            }
        };

        const currentDiv = scrollRef.current;
        if (currentDiv) {
            currentDiv.addEventListener('scroll', handleScroll);

            // Cleanup function to remove the event listener when the component unmounts
            return () => currentDiv.removeEventListener('scroll', handleScroll);
        }
    }, [displayScrollHelper]); // Add displayScrollHelper to the dependency array


    const [params, setParams] = React.useState({
            chosenTag: ''
        }
    )

    const searchParams = new URLSearchParams();
    searchParams.append("target", props.target);
    if (params.chosenTag) {
        searchParams.append("tags", params.chosenTag);
    }

    const {data: posts, error, isLoading} = useSWR<(Tables<"posts"> & {
        profiles: Tables<"profiles">
    })[]>(`/api/posts?${searchParams.toString()}`, fetcher);

    return (
        <div className={"flex md:flex-row  flex-col md:space-x-4 space-y-4 flex-grow overflow-hidden"}>
            <div className={"space-y-4"}>
                <div className={"flex-grow min-w-40 space-y-8 p-4 border rounded-md"}>
                    <div>
                        <h3 className={"text-xl font-bold"}>
                            Filters
                        </h3>
                        <p className={"text-sm text-muted-foreground"}>
                            Filter posts by tag or sort them by relevance or date posted.
                        </p>
                    </div>
                    <div>
                        <Label>Sort by</Label>
                        <Select defaultValue={"rel"}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={"Relevance"}/>
                            </SelectTrigger>
                            <SelectContent className={"w-full"}>
                                <SelectItem value="rel">Relevance</SelectItem>
                                <SelectItem value="dataA">Date posted (Asc)</SelectItem>
                                <SelectItem value="dateB">Date posted (Desc)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Filter</Label>
                        <ToggleGroup onValueChange={(e) => {
                            setParams((prevParams) => ({...prevParams, chosenTag: e}))
                        }} className={"flex flex-wrap justify-start gap-2"} type={"single"}>
                            {props.tags.map(tag =>
                                <ToggleGroupItem className={"hover:bg-background data-[state=on]:bg-background p-0"}
                                                 key={tag.key} value={tag.key}>
                                    <Badge variant={params.chosenTag === tag.key ? 'default' : 'outline'}>
                                        {tag.value}
                                    </Badge>
                                </ToggleGroupItem>
                            )}
                        </ToggleGroup>
                    </div>
                </div>

                <Button className={"w-full"} asChild>
                    <Link href={`/posts/new?type=question&target=${props.target}`}>Post here</Link>
                </Button>
            </div>
            <div className={"relative md:w-3/4 overflow-y-scroll"}>
                <div ref={scrollRef} className={"h-full overflow-y-scroll"}>
                    <div className={"flex flex-col space-y-4 items-end h-fit"}>
                        <PostsList isLoading={isLoading} posts={posts} error={error}/>
                    </div>
                </div>
                {posts && posts.length > 0 &&
                    <div
                        className={`absolute px-4 py-2 rounded-3xl backdrop-brightness-[98%] backdrop-blur bottom-5 left-0 right-0 mx-auto w-fit h-fit text-sm transition-opacity ${!displayScrollHelper && "opacity-0"}`}>
                        Scroll for more...
                    </div>
                }

            </div>
        </div>
    )
}

function PostsList({isLoading, posts, error}: {
    isLoading: boolean,
    posts?: (Tables<"posts"> & { profiles: Tables<"profiles"> })[],
    error: any
}) {
    if (isLoading) {
        return (
            <>
                {Array.from({length: 3}).map((_, i) => (
                    <Skeleton className={"w-full max-w-screen-lg h-48"} key={i}/>
                ))}
            </>
        );
    }

    if (posts && posts.length > 0) {
        return (
            <>
                {posts.map((post, i) => (
                    <Post key={post.id} post={post}/>
                ))}
            </>
        );
    }

    return (
        <div className={"w-full border rounded-md py-2 px-4 m-auto text-center"}>
            {error ? (
                <ServerError>
                    <p>{error.message}</p>
                </ServerError>
            ) : (
                <>
                    <p>No posts</p>
                    <p className={"text-sm text-muted-foreground"}>
                        Be first to post!
                    </p>
                </>
            )}
        </div>
    );
}

export default QuestionsDisplay;