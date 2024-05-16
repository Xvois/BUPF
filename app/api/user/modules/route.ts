import {Tables} from "@/types/supabase";
import {createClient} from "@/utils/supabase/server";
import apiAxios from "@/utils/axios/apiAxios";

export async function GET(request: Request) {
	const supabase = createClient();

	// Get the current user
	const userResponse = await supabase.auth.getUser();
	if (userResponse.error) {return Response.json(userResponse);}
	const user = userResponse.data.user;

	// Get the profile of the current user, including their courses
	const profileResponse = await supabase.from("profiles").select("*, courses (*)").eq("id", user.id).single();
	if (profileResponse.error) {return Response.json(profileResponse);}
	const profile = profileResponse.data;

	// Get the entry date of the user and the courses they are enrolled in
	const entry = profile.entry_date;
	const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
	const courses = profile.courses;

	// If the user is not enrolled in a course, return all modules
	if (courses === null || entry === null) {
		const modulesResponse = await apiAxios.get("/api/modules").then(response => response.data);
		if (modulesResponse.error) return Response.json(modulesResponse);
		return Response.json({data: modulesResponse.data, error: null});
	}

	// Calculate the current year of the user based on their entry date
	const year = Math.ceil((Date.now() - new Date(entry).getTime()) / YEAR_IN_MS);

	// Get the modules for the courses the user is enrolled in
	const courseModulesResponse = await apiAxios.get(`/api/courses/[id]/modules`, {id: courses.id.toString()}).then(response => response.data);
	if (courseModulesResponse.error) {return Response.json(courseModulesResponse);}
	const courseModules = courseModulesResponse.data;

	let requiredModules: Tables<"modules">[] = [];
	let optionalModules: Tables<"modules">[] = [];

	// Based on the current year of the user, select the required and optional modules
	switch (year) {
		case 1:
			requiredModules = (courseModules.year_1).required;
			optionalModules = (courseModules.year_1).optional;
			break;
		case 2:
			requiredModules = (courseModules.year_2).required;
			optionalModules = (courseModules.year_2).optional;
			break;
		case 3:
			requiredModules = (courseModules.year_3).required;
			optionalModules = (courseModules.year_3).optional;
			break;
		case 4:
			if (courseModules.year_4) {
				requiredModules = (courseModules.year_4).required;
				optionalModules = (courseModules.year_4).optional;
			}
			break;
		case 5:
			if (courseModules.year_5) {
				requiredModules = (courseModules.year_5).required;
				optionalModules = (courseModules.year_5).optional;
			}
			break;
		default:
			break;
	}

	// Prepare the data to be returned
	const data = {
		required: requiredModules,
		optional: optionalModules
	};

	// Return the data and no error
	return Response.json({data, error: null});
}