import {useFormContext} from "react-hook-form";
import useSWR from "swr";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/utils/cn";
import {ChevronsUpDown} from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {fetcher} from "@/utils/fetcher";

const CourseDetailsInputs = () => {
	const form = useFormContext()
	const {data: response} = useSWR('/api/courses', (url) => fetcher(url));
	const courses = response?.data;
	console.log(courses)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
	return (
		<>
			<FormField
				control={form.control}
				name="course"
				render={({field}) => (
					<FormItem className="flex flex-col">
						<FormLabel>Course</FormLabel>
						<Popover open={popoverOpen} onOpenChange={(e) => setPopoverOpen(e)}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="outline"
										role="combobox"
										aria-haspopup="listbox"
										aria-expanded={popoverOpen}
										aria-controls="listbox"
										aria-label={"Select course"}
										className={cn(
											"w-64 sm:w-96 md:w-full justify-between overflow-x-clip",
											!field.value && "text-muted-foreground"
										)}
									>
										{field.value
											? courses?.find(
												(course) => course.id === field.value
											)?.title
											: "Select course"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="max-w-[572px] w-screen p-0">
								<Command className={"max-h-96 w-full pt-12"}>
									<CommandList>
										<div
											className={"fixed z-10 bg-popover w-full rounded-md top-[1px] scale-x-[99%]"}>
											<CommandInput placeholder="Search courses..."/>
										</div>
										<CommandEmpty>No course found.</CommandEmpty>
										<CommandGroup className={"overflow-visible"} heading={"Standalone"}>
											{courses?.filter(course => !course.title.toLowerCase().includes('theoretical') && !course.title.toLowerCase().includes('astrophysics') && course.id !== 0).map((course) => (
												<CommandItem
													value={course.type + course.title}
													key={course.id}
													onSelect={() => {
														setPopoverOpen(false);
														form.setValue("course", course.id.toString());
													}}
												>
													<p>{course.title} <span
														className={"text-xs text-muted-foreground"}>{course.type}</span>
													</p>
												</CommandItem>
											))}
										</CommandGroup>
										<CommandSeparator/>
										<CommandGroup className={"overflow-visible"} heading={"With Astrophysics"}>
											{courses?.filter(course => course.title.toLowerCase().includes('astrophysics') && course.id !== 0).map((course) => (
												<CommandItem
													value={course.type + course.title}
													key={course.id}
													onSelect={() => {
														setPopoverOpen(false);
														form.setValue("course", course.id.toString())
													}}
												>
													<p>{course.title} <span
														className={"text-xs text-muted-foreground"}>{course.type}</span>
													</p>
												</CommandItem>
											))}
										</CommandGroup>
										<CommandSeparator/>
										<CommandGroup className={"overflow-visible"} heading={"With Theoretical"}>
											{courses?.filter(course => course.title.toLowerCase().includes('theoretical') && course.id !== 0).map((course) => (
												<CommandItem
													value={course.type + course.title}
													key={course.id}
													onSelect={() => {
														setPopoverOpen(false);
														form.setValue("course", course.id.toString())
													}}
												>
													<p>{course.title} <span
														className={"text-xs text-muted-foreground"}>{course.type}</span>
													</p>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<FormDescription>
							Your enrolled course. This will affect what modules are available to you.
							Not a physics student? Choose <Button variant={"link"} type={"button"}
																  onClick={() => form.setValue("course", "0")}
																  className={"underline p-0 text-muted-foreground h-fit"}>Other here</Button>.
						</FormDescription>
						<FormMessage/>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="year"
				render={({field}) => (
					<FormItem className={"w-full"}>
						<FormLabel>
							Current year of study
						</FormLabel>
						<FormControl>
							<Input type={"number"} {...field} />
						</FormControl>
						<FormDescription>
							Your current year of study. This will affect what modules are available to you.
						</FormDescription>
						<FormMessage/>
					</FormItem>
				)}
			/>
		</>
	)
}

export default CourseDetailsInputs;