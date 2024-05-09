import {Separator} from "@/components/ui/separator";
import React, {Fragment} from "react";
import {BookPlus, CircleFadingPlus} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import DynamicIconGrid from "@/components/DynamicIconGrid/DynamicIconGrid";
import {createClient} from "@/utils/supabase/server";
import CoursesShowcase from "@/components/CoursesShowcase/CoursesShowcase";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export default async function Landing() {

    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        await supabase.auth.signInAnonymously();
    }

    return (
        <div className={"space-y-8 w-full"}>
            <div className={" text-center overflow-hidden"}>
                <div className={"relative flex flex-col h-96 items-center align-middle justify-center space-y-8"}>
                    <div className={"absolute left-0 top-0 w-full h-full opacity-15 z-[-1]"}>
                        <DynamicIconGrid/>
                    </div>
                    <div className={"p-6"}>
                        <h1 className={"font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl"}>
                            By students, For students
                        </h1>
                        <p className={"text-muted-foreground"}>
                            The Bath University Physics Forum is the student run forum for all things physics at the
                            University
                            of Bath.
                        </p>
                    </div>
                    <div className={"inline-flex flex-row gap-4 mx-auto"}>
                        {
                            user ?
                                <Button asChild>
                                    <Link href={"/home"}>
                                        Go to dashboard
                                    </Link>
                                </Button>
                                :
                                <Fragment>
                                    <Button variant={"outline"} asChild>
                                        <Link href={"/login"}>
                                            I am an academic
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={"/login"}>
                                            Join now
                                        </Link>
                                    </Button>
                                </Fragment>
                        }

                    </div>
                </div>
            </div>
            <Separator/>
            <section className={"p-6 space-y-8"}>
                <div>
                    <h2 className={"font-black text-4xl"}>
                        Your course, Your modules
                    </h2>
                    <p>
                        All you need to do is select your course and your modules will automatically be updated,
                        allowing
                        you
                        to interact with other students and academics taking the same modules as you.
                    </p>
                    <p>
                        Try it out here by selecting a course and start year.
                    </p>
                </div>
                <div className={"border-t p-6"}>
                    <CoursesShowcase/>
                </div>
            </section>
            <Separator/>
            <section className={"flex flex-col p-6 space-y-4 text-right w-fit ml-auto"}>
                <div>
                    <h2 className={"font-black text-4xl"}>
                        Tailor your posts
                    </h2>
                    <p>
                        The Bath University Physics Forum is a place where you can ask questions, read articles and
                        spark
                        discussions about physics topics that matter to you.
                    </p>
                </div>
                <div className={"flex flex-row justify-evenly gap-8 flex-wrap"}>
                    <DisplayCard>
                        <h2 className={"font-bold text-xl inline-flex gap-1"}>
                            Articles
                        </h2>
                        <p>
                            Read articles written by students and staff at the University of Bath.
                        </p>
                    </DisplayCard>
                    <DisplayCard>
                        <h2 className={"font-bold text-xl inline-flex gap-1 items-center"}>
                            <CircleFadingPlus className={"h-5 w-5"}/>
                            Questions
                        </h2>
                        <p>
                            Ask questions and get answers from a community of students and academics.
                        </p>
                    </DisplayCard>
                    <DisplayCard>
                        <h2 className={"font-bold text-xl inline-flex gap-1 items-center"}>
                            <BookPlus className={"h-5 w-5"}/>
                            Discussions
                        </h2>
                        <p>
                            Spark discussion about physics topics that matter to you.
                        </p>
                    </DisplayCard>
                </div>
            </section>
        </div>
    )
}


const DisplayCard = ({children}: { children: React.ReactElement[] }) => {
    return (
        <div className={"rounded-md border p-4 flex flex-col gap-4 max-w-96 hover:bg-secondary"}>
            {children}
        </div>
    )
}
