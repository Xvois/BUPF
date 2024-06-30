import DynamicSections from "@/components/DynamicSections";
import WelcomeSection from "@/app/_landing/_components/WelcomeSection";
import MarkdownSection from "@/app/_landing/_components/MarkdownSections";
import CourseSection from "@/app/_landing/_components/CourseSection";


export default function Landing() {
    return (
        <DynamicSections className={"w-full"}>
            <WelcomeSection/>
            <MarkdownSection/>
            <CourseSection/>
        </DynamicSections>
    );
}






