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
import {Badge} from "@/components/ui/badge";
import LinkBox from "@/components/LinkBox";
import {ServerError} from "@/components/ServerError";

// Calculate the weight for a post
function calculateWeight(post: Tables<"posts">) {
    const now = Date.now();
    const postDate = new Date(post.created_at).getTime();
    const timeDifference = now - postDate; // in milliseconds
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // convert to days
    const commentsWeight = post.tl_comments.length;
    return commentsWeight - daysDifference; // adjust these values as needed
}

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


    // Initialize state for user-selected parameters
    const [params, setParams] = React.useState({
        chosenTag: '',
        sort: 'rel'
    });

    // Construct the filter and sort queries based on user-selected parameters
    const queryFilter = {target: props.target, tags: [params.chosenTag]};
    const querySort = {ascending: params.sort === "asc" || params.sort === "rel"};

    // Fetch posts data from the API using SWR
    let {data: posts, error, isLoading} = useSWR<(Tables<"posts"> & {
        profiles: Tables<"profiles">
    })[]>(`/api/posts?filter=${JSON.stringify(queryFilter)}&sort=${JSON.stringify(querySort)}`, fetcher);

    // If posts data is available, create a copy of the posts array
    // This is done to avoid mutating the original data when sorting
    const postsCopy = posts ? [...posts] : null;

    // If the user-selected sort parameter is 'rel', sort the posts copy
    // The sorting is done based on the weight calculated for each post
    // If the sort parameter is not 'rel', use the original posts data
    const sortedPosts = params.sort === 'rel' ? postsCopy?.sort((a, b) => calculateWeight(b) - calculateWeight(a)) : posts;

    return (
        <div className={"flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 flex-grow overflow-hidden"}>
            <div className={"space-y-4 flex flex-col"}>
                <div className={"flex-grow min-w-40 md:max-w-[350px] space-y-8 p-4 border rounded-md"}>
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
                        <Select onValueChange={(e) => {
                            setParams((prevParams) => ({...prevParams, sort: e}))
                        }} defaultValue={"rel"}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={"Relevance"}/>
                            </SelectTrigger>
                            <SelectContent className={"w-full"}>
                                <SelectItem value="rel">Relevance</SelectItem>
                                <SelectItem value="asc">Date posted (Asc)</SelectItem>
                                <SelectItem value="desc">Date posted (Desc)</SelectItem>
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
                <div className={"flex-grow space-y-8 md:max-w-[350px] p-4 border rounded-md hidden md:block max-h-full"}>
                    <div>
                        <h3 className={"text-xl font-bold"}>
                            Details
                        </h3>
                        <p className={"text-sm text-muted-foreground"}>
                            Details about this modules questions.
                        </p>
                    </div>
                    <div>
                        <p className={"text-sm text-muted-foreground"}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nunc nec odio ultricies
                        </p>
                    </div>
                </div>
            </div>
            <div className={"relative md:w-3/4 overflow-y-scroll"}>
                <ServerError>
                    {error?.message}
                </ServerError>
                <div ref={scrollRef} className={"h-full overflow-y-scroll"}>
                    <div className={"flex flex-col space-y-4 items-end h-fit"}>
                        <PostsList isLoading={isLoading} posts={sortedPosts} error={error} target={props.target}/>
                    </div>
                </div>
                {posts && posts.length > 5 &&
                    <div
                        className={`absolute px-4 py-2 rounded-3xl backdrop-brightness-[98%] backdrop-blur bottom-5 left-0 right-0 mx-auto w-fit h-fit text-sm transition-opacity ${!displayScrollHelper && "opacity-0"}`}>
                        Scroll for more...
                    </div>
                }

            </div>
        </div>
    )
}

function PostsList({isLoading, posts, error, target}: {
    isLoading: boolean,
    posts?: (Tables<"posts"> & { profiles: Tables<"profiles"> })[],
    error: any,
    target: string
}) {
    if (isLoading) {
        return (
            <>
                {Array.from({length: 5}).map((_, i) => (
                    <Skeleton className={"w-full max-w-screen-lg h-32"} key={i}/>
                ))}
            </>
        );
    }

    if (posts && posts.length > 0) {
        return (
            <>
                {posts.map((post) => (
                    <Post key={post.id} post={post}/>
                ))}
                {
                    posts.length < 3 &&
                    <LinkBox title={"Start a conversation."}
                             href={`/posts/new?type=question&target=${target}`}
                             className={"w-full scale-[99%] hover:scale-[100%]"}
                             description={"Questions are a little dry right now. Why not start a conversation by asking a question?"}/>
                }
            </>
        );
    }

    return (
        <LinkBox title={"Start a conversation."}
                 href={`/posts/new?type=question&target=${target}`}
                 className={"w-full scale-[99%] hover:scale-[100%]"}
                 description={"Questions are a little dry right now. Why not start a conversation by asking a question?"}/>
    );
}

export default QuestionsDisplay;