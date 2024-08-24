import {h1, p} from "@/styles/text";


export default function SectionHeader({title, description, icon, type}: {
    title: string,
    description: string,
    icon: React.ReactNode,
    type: string
}) {
    return (
        <header className={"flex flex-col p-6 h-40 justify-center"}>
            <div className="inline-flex gap-2">
                {icon}
                <p>{type}</p>
            </div>
            <h1 className={h1}>{title}</h1>
            <p className={p}>{description}</p>
        </header>
    )
}