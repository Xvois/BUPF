import {CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import AssignmentsForm from "@/app/admin/assignments/_components/assignments-form";
import React from "react";
import {createClient} from "@/utils/supabase/server";


export default async function Page() {

    const supabase = await createClient();

    const {data: modules, error} = await supabase.from("modules").select("*");

    if(error) {
        return; // TODO: Some fallback
    }

    return (
        <React.Fragment>
            <CardHeader>
                <CardTitle>
                    Modify module assignments
                </CardTitle>
                <CardDescription>
                    Select modules and assign them to courses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AssignmentsForm modules={modules} />
            </CardContent>
        </React.Fragment>
    )
}