"use server";


import {z} from "zod";
import {formSchema} from "@/reuseable-pages/combo-display/_schema/formSchema";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";

export default async function post(values: z.infer<typeof formSchema>) {

	const headersList = headers();
	const domain = headersList.get('host') || "";
	const fullUrl = headersList.get('referer') || "";

	// Create a new URL object from the fullUrl
	const url = new URL(fullUrl);

	// Extract the path by subtracting the domain from the full URL
	const path = url.href.replace(url.origin, '');

	console.log(path);


	const supabase = createClient();

	const tags =
		[
			{
				name: "thermodynamics",
				keywords: ["thermo", "thermodynamics", "carnot", "heat", "entropy", "gibbs", "hemholtz", "enthalpy", "clausius"]
			},
			{
				name: "quantum mechanics",
				keywords: ["quantum", "mechanics", "wave", "particle", "schrodinger", "heisenberg", "uncertainty"]
			},
			{
				name: "classical mechanics",
				keywords: ["classical", "mechanics", "newton", "lagrange", "hamilton", "euler", "d'alembert"]
			},
			{
				name: "relativity",
				keywords: ["relativity", "einstein", "lorentz", "minkowski", "curvature", "gravity"]
			},
			{
				name: "electromagnetism",
				keywords: ["electromagnetism", "maxwell", "faraday", "gauss", "ampere", "coulomb", "electric", "magnetic"]
			},
			{
				name: "statistical mechanics",
				keywords: ["statistical", "mechanics", "boltzmann", "gibbs", "partition", "ensemble", "entropy", "microstate"]
			},
			{
				name: "optics",
				keywords: ["optics", "light", "lens", "mirror", "refraction", "reflection", "diffraction", "interference"]
			},
			{
				name: "mathematics",
				keywords: ["mathematics", "maths", "algebra", "calculus", "geometry", "trigonometry", "analysis", "topology"]
			},
			{
				name: "astrophysics",
				keywords: ["astrophysics", "cosmology", "galaxy", "star", "planet", "black hole", "big bang", "dark matter", "supernova"]
			},
			{
				name: "experimental labs",
				keywords: ["lab", "experiment", "experimentation", "data", "analysis", "measurement", "error", "uncertainty"]
			},
			{
				name: "computational physics",
				keywords: ["computational", "simulation", "numerical", "algorithm", "computation", "programming", "code", "python", "coding", "spyder", "jupyter"]
			}
		]

	const matchingTags = tags.filter(tag => tag.keywords.some(keyword => values.content.toLowerCase().includes(keyword))).map(tag => tag.name);

	const postObject = {
		heading: values.heading,
		content: values.content,
		type: values.type,
		target: values.target,
		target_type: values.targetType,
		tags: matchingTags,
		anonymous: values.anonymous,
	}

	const {data: post, error: postError} = await supabase.from("posts").insert(postObject).select();

	if (postError) {
		throw new Error(`Failed to post: ${postError.message}`);
	}

	return revalidatePath(path, "page");
};