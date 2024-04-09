import PostForm from "@/app/posts/new/post-form";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {z} from "zod";
import {formSchema} from "@/app/posts/new/formSchema";
import {NextResponse} from "next/server";


export default async function Page({searchParams}: { searchParams: { type?: string, target? :string,  error?: string } }) {

    const {type, target} = searchParams;

    const post = async (values: z.infer<typeof formSchema>) => {
        "use server";

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

        const {error: postError} = await supabase.from("posts").insert(postObject);

        if (postError) {
            throw new Error(`Failed to post: ${postError.message}`);
        }

        return redirect(`/${values.targetType}s/${values.target}`);
    };

    return (
        <div className={"w-full"}>
            <PostForm post={post} defaultParams={{
                type: type,
                target: target
            }} />
        </div>
    )
}

