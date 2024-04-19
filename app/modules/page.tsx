import {Separator} from "@/components/ui/separator";
import {Package} from "lucide-react";
import {Suspense} from "react";
import {CoreModules} from "@/app/modules/components/CoreModules";
import {OptionalModules} from "@/app/modules/components/OptionalModules";
import {ModulesSkeleton} from "@/app/modules/components/ModulesSkeleton";


export default async function Modules() {
    return (
        <div className="w-full space-y-4">
            <header
                className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none">
                <div className={"inline-flex gap-2"}>
                    <Package/>
                    <p>Section</p>
                </div>
                <h1 className={"font-black text-4xl"}>Modules</h1>
                <p>
                    View your modules, see what's coming up, and discuss with your peers.
                </p>
            </header>
            <Separator/>
            <Suspense fallback={<ModulesSkeleton/>}>
                <CoreModules/>
            </Suspense>
            <Separator/>
            <Suspense fallback={<ModulesSkeleton/>}>
                <OptionalModules/>
            </Suspense>
        </div>
    )
}
