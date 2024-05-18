import {Separator} from "@/components/ui/separator";
import {ExternalLink} from "lucide-react";

export default function Page() {
    return (
        <div className="space-y-4 w-full">
            <header className={"p-6"}>
                <p className={"text-3xl leading-none"}>About the</p>
                <h1 className={"font-black text-4xl"}>Bath University Physics Forum</h1>
                <p>
                    Details about the forum, its operations and the team behind it.
                </p>
            </header>
            <Separator/>
            <section className={"space-y-2 p-6"}>
                <h2 className={"text-2xl font-bold"}>About the forum</h2>
                <Separator/>
                <p className={"text-muted-foreground"}>
                    The Bath University Physics Forum is an unofficial student lead initiative to provide a platform for
                    students to
                    discuss physics topics, ask questions, and share knowledge with their peers, all in one place.
                    The aim is to have a more accessible platform to engage with the course than the current Moodle and
                    other student platforms like group chats.
                </p>
                <p className={"text-muted-foreground"}>
                    It is student lead by means of the forum being created by students, for students. The platform
                    itself
                    is open source, <a
                    className={"underline inline-flex items-center gap-1"}
                    href={"https://github.com/Xvois/BUPF"}>available here <ExternalLink
                    className={"w-3 h-3"}/></a>, and contributions by students are welcome.
                </p>
            </section>
            <section className={"space-y-2 p-6"}>
                <h2 className={"text-2xl font-bold"}>Courses & Modules</h2>
                <Separator/>
                <p className={"text-muted-foreground"}>
                    When you sign up, you select the course you are currently enrolled on and the year that continuous studies began,
                    which will give you access to the modules you are currently studying. The forum currently only supports modules
                    taken under the new curriculum, there are no plans to support the old curriculum.

                </p>
                <p className={"text-muted-foreground"}>
                    Modules are added to the forum by the team behind it, and are updated as the course progresses. If you
                    are missing a module, you can request it to be added by contacting the team.
                </p>
                <p className={"text-muted-foreground"}>
                    You can change your course and year at any time in the settings page.
                </p>
            </section>
            <section className={"space-y-2 p-6"}>
                <h2 className={"text-2xl font-bold"}>Data collection</h2>
                <Separator/>
                <p className={"text-muted-foreground"}>
                    The Bath University Physics Forum is committed to protecting your privacy and data. We do not
                    collect
                    any personal information about you unless you voluntarily provide it to us. Any personal
                    information
                    you provide to us will be stored securely and will not be shared with any third parties.
                </p>
                <p className={"text-muted-foreground"}>
                    Your email address will only be used to send you a confirmation email when you sign up, and to send
                    you
                    notifications about your account as well as any other events you directly consent to. You can change
                    your email address at any time in the settings page.
                </p>
                <p className={"text-muted-foreground"}>
                    Deleting your account will remove all direct information about you from our database, but your posts
                    and some comments will remain with your profile
                    anonymised. We do this to keep the forum useful and informative for other users.
                </p>
                <p className="text-muted-foreground">
                    The platform may, at times, use <a
                    className={"underline inline-flex items-center gap-1"}
                    href={"https://vercel.com/docs/analytics"}>Vercel Analytics <ExternalLink
                    className={"w-3 h-3"}/></a> and <a
                    className={"underline inline-flex items-center gap-1"}
                    href={"https://vercel.com/docs/speed-insights"}>Vercel Speed Insights <ExternalLink
                    className={"w-3 h-3"}/></a> which collects some data about your usage of the platform. This data is
                    used to improve the platform and is not shared with any third parties.
                </p>
            </section>
        </div>
    )
}
