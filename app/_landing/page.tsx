/*
THIS FILE WILL NOT BE DIRECTLY ACCESSIBLE, INSTEAD IT IS REFERENCED IN THE TOP LEVEL PAGE
 */


import DynamicSections from "@/components/DynamicSections";
import WelcomeSection from "@/app/_landing/_components/WelcomeSection";
import MarkdownSection from "@/app/_landing/_components/MarkdownSections";
import CourseSection from "@/app/_landing/_components/CourseSection";
import OpenSourceSection from "@/app/_landing/_components/OpenSourceSection";
import {createClient} from "@/utils/supabase/server";

export default function Landing() {

    return (
        <DynamicSections className={"w-full"}>
            <WelcomeSection/>
            <MarkdownSection/>
            <CourseSection/>
            <OpenSourceSection/>
        </DynamicSections>
    );
}