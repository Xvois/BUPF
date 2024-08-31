import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useFormContext} from "react-hook-form";
import {ChangeEvent, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import resizeImage from "@/utils/resize";


export default function ProfilePictureUpload() {
    const [previewSrc, setPreviewSrc] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const form = useFormContext();

    const fileError = form.formState.errors.profilePicture?.message;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const settings = {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 300,
            }

            resizeImage(file, settings).then((resizedFile) => {
                form.setValue("profilePicture", resizedFile)
            })

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewSrc(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={e => setIsDialogOpen(e)}>
            <DialogTrigger asChild>
                <Button variant={fileError ? "destructive" : "outline"}>Upload new profile picture</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Profile Picture
                    </DialogTitle>
                    <DialogDescription>
                        Upload a new profile picture.
                    </DialogDescription>
                </DialogHeader>
                <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>New file</FormLabel>
                            <FormControl>
								<Input type={"file"} accept={"image/*"} onChange={handleFileChange}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {previewSrc && <Image alt={"Preview"} src={previewSrc} width={300} height={300}
                                      className={"rounded-full w-[300px] h-[300px] object-cover mx-auto"}/>}
                <DialogClose asChild>
                    <Button variant={"default"}>Finish</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}