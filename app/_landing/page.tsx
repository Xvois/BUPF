/*
THIS FILE WILL NOT BE DIRECTLY ACCESSIBLE, INSTEAD IT IS REFERENCED IN THE TOP LEVEL PAGE
 */


import DynamicSections from "@/components/DynamicSections";
import WelcomeSection from "@/app/_landing/_components/WelcomeSection";
import MarkdownSection from "@/app/_landing/_components/MarkdownSections";
import CourseSection from "@/app/_landing/_components/CourseSection";
import DiscussionSection from "@/app/_landing/_components/DiscussionSections";

export default function Landing() {
    return (
        <DynamicSections className={"w-full"}>
            <WelcomeSection/>
            <MarkdownSection/>
            <CourseSection/>
            <DiscussionSection/>
        </DynamicSections>
    );
}