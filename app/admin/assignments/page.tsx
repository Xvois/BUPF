import apiAxios from "@/utils/axios/apiAxios";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import AssignmentsForm from "@/app/admin/assignments/_components/assignments-form";
import React from "react";


export default async function Page() {

    const {data: {data: modules, error: modulesError}} = await apiAxios.get("/api/modules");

    if(modulesError) {
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