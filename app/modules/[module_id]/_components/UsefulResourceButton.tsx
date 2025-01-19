'use client'

import {Button, ButtonProps} from "@/components/ui/button";
import {lazy, Suspense, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form} from "@/components/ui/form";
import {BookPlus} from "lucide-react";
import {resourceSchema} from "@/app/modules/[module_id]/_schema/resourceSchema";
import {uploadResource} from "@/app/modules/[module_id]/_actions/uploadResource";
import FormSkeleton from "@/app/modules/[module_id]/_components/FormSkeleton";

const LazyResourceForm = lazy(() => import("./resource-form"));

export default function UsefulResourceButton({module_id, ...props}: { module_id: string } & ButtonProps) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof resourceSchema>>({
        mode: "onSubmit",
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: "",
            description: "",
            url: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof resourceSchema>) => {
        await uploadResource(values, module_id).then(() => setIsDialogOpen(false));
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e)}>
            <DialogTrigger asChild>
				<Button {...props} className={"space-x-2"}>
					<BookPlus className={"h-4 w-4"}/>
					<p>Add a resource</p>
				</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a useful resource</DialogTitle>
                    <DialogDescription>
                        Share a resource that you found useful.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Suspense fallback={<FormSkeleton/>}>
                            <LazyResourceForm />
                        </Suspense>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
