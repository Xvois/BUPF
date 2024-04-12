import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";
import PaginationWrapper from "@/components/PaginationWrapper";
import {Tables} from "@/types/supabase";
import {Separator} from "@/components/ui/separator";
import Post from "@/components/Post";


export default async function UserPosts({params}: { params: { user_id: string } }) {
    const supabase = createClient();
    const {data: {user}, error} = await supabase.auth.getUser();
    if (!user) {
        return redirect("/login");
    }

    const {data: profile, error: profileError} = await supabase.from('profiles').select().eq('id', user.id).single();
    const {
        data: posts,
        error: postsError
    } = await supabase.from('posts').select('*, profiles (*)').eq('owner', user.id).order('created_at', {ascending: false});

    if (!posts || !profile) {
        return redirect("/login");
    }

    const questions = posts.filter(post => post.type === "question") as (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[];
    const discussions = posts.filter(post => post.type === "discussion") as (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[];
    const articles = posts.filter(post => post.type === "article") as (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[];

    // Split posts into groups of at most 3

    const groupedQuestions = questions.reduce((grouped: (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[][], post, index) => {
        const groupIndex = Math.floor(index / 4);
        if (!grouped[groupIndex]) {
            grouped[groupIndex] = [];
        }
        grouped[groupIndex].push(post);
        return grouped;
    }, []);
    const groupedDiscussions = discussions.reduce((grouped: (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[][], post, index) => {
        const groupIndex = Math.floor(index / 4);
        if (!grouped[groupIndex]) {
            grouped[groupIndex] = [];
        }
        grouped[groupIndex].push(post);
        return grouped;
    }, []);
    const groupedArticles = articles.reduce((grouped: (Tables<"posts"> & {
        profiles: Tables<"profiles"> | null
    })[][], post, index) => {
        const groupIndex = Math.floor(index / 4);
        if (!grouped[groupIndex]) {
            grouped[groupIndex] = [];
        }
        grouped[groupIndex].push(post);
        return grouped;
    }, []);

    return (
        <div className={"w-full space-y-8"}>
            <header>
                <p className={"text-3xl leading-none"}>{profile.first_name}'s</p>
                <h1 className={"font-black text-4xl"}>Questions, Discussions & Articles</h1>
                <p>
                    View your posts, questions, articles, and discussions here.
                </p>
            </header>
            <Separator/>
            <section className={"space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Questions</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        These are questions that you have asked. You can view them here.
                    </p>
                </div>
                <div>
                    {groupedQuestions.length > 0 ?
                        <PaginationWrapper>
                            {
                                groupedQuestions.map((group, index) => (
                                    <div key={index} className={"flex flex-col gap-4 w-full h-[525px]"}>
                                        {
                                            group.map((post) => (
                                                <Post post={post} key={post.id}/>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </PaginationWrapper>
                        :
                        <div>
                            <p className={"text-sm text-muted-foreground"}>No questions found.</p>
                        </div>
                    }
                </div>
            </section>
            <Separator/>
            <section className={"space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Discussions</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        These are all the discussions that you have started. You can view them here.
                    </p>
                </div>
                <div>
                    {groupedDiscussions.length > 0 ?
                        <PaginationWrapper>
                            {
                                groupedDiscussions.map((group, index) => (
                                    <div key={index} className={"flex flex-col gap-4 w-full h-[525px]"}>
                                        {
                                            group.map((post) => (
                                                <Post post={post} key={post.id}/>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </PaginationWrapper>
                        :
                        <div>
                            <p className={"text-sm text-muted-foreground"}>No discussions found.</p>
                        </div>
                    }
                </div>
            </section>
            <Separator/>
            <section className={"space-y-4"}>
                <div>
                    <h2 className={"text-2xl font-bold"}>Articles</h2>
                    <p className={"text-sm text-muted-foreground"}>
                        These are all the articles you hav written. You can view them here.
                    </p>
                </div>
                <div>
                    {groupedArticles.length > 0 ?
                        <PaginationWrapper>
                            {
                                groupedArticles.map((group, index) => (
                                    <div key={index} className={"flex flex-col gap-4 w-full h-[500px]"}>
                                        {
                                            group.map((post) => (
                                                <Post post={post} key={post.id}/>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </PaginationWrapper>
                        :
                        <div>
                            <p className={"text-sm text-muted-foreground"}>No articles found.</p>
                        </div>
                    }
                </div>
            </section>
        </div>
    );
}