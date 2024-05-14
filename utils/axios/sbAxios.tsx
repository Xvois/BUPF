/*
 Axios instance that extends the default Axios instance to include a method for sending GET requests to a specified route and returning a typed response.
 */

import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {CourseModulesResponse, CourseResponse, CoursesResponse} from "@/types/api/courses/types";
import {ModuleResponse, ModulesResponse} from "@/types/api/modules/types";
import {PostResponse, PostsResponse} from "@/types/api/posts/types";
import {ProfileResponse} from "@/types/api/profiles/types";
import {UserModulesResponse} from "@/types/api/user/types";


type RouteResponseMap = {
	'/api/courses': CoursesResponse,
	'/api/courses/[id]': CourseResponse,
	'/api/courses/[id]/modules': CourseModulesResponse,
	'/api/modules': ModulesResponse,
	'/api/modules/[id]': ModuleResponse,
	'/api/posts/[id]': PostResponse,
	'/api/posts': PostsResponse,
	'/api/profiles/[id]': ProfileResponse,
	'/api/user/modules': UserModulesResponse
};

type Params = {
	searchParams?: string;
	[key: string]: string | undefined;
}

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

class SBAxios extends axios.Axios {
	constructor(config?: AxiosRequestConfig) {
		super(config);
	}

	/**
	 * This method is used to send a GET request to a specified route and return a typed response.
	 * The route is specified as a key of the RouteResponseMap type, and the ids parameter is used to replace placeholders in the route.
	 *
	 * @template Route - The route type, which should be a key of RouteResponseMap.
	 * @param {Route} route - The route to which the GET request should be sent.
	 * @param {Params} params - An object where the keys are the parameter names and the values are the parameter
	 * values, which will be used to replace placeholders in the route and append search parameters to the URL.
	 * @param {AxiosRequestConfig} [config] - Optional configuration for the axios request.
	 * @returns {Promise<AxiosResponse<RouteResponseMap[Route]>>} - A Promise that resolves to the response of the GET request.
	 *
	 * @example
	 * // Send a GET request to the '/api/courses/[id]' route, replacing '[id]' with '33'
	 * sbAxios.sbGet('/api/courses/[id]', { id: '33' })
	 *   .then(response => {
	 *     // Handle the response
	 *     console.log(response.data);
	 *   })
	 *   .catch(error => {
	 *     // Handle the error
	 *     console.error(error);
	 *   });
	 */
	async sbGet<Route extends keyof RouteResponseMap>(
		route: Route,
		params?: Params,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<RouteResponseMap[Route]>> {

		const isRelativeUrl = (url: string) => {return !(/^(?:[a-z]+:)?\/\//i.test(url));}

		if (!isRelativeUrl(route as string)) {
			throw new Error('(sbFetch): Route must be a relative URL.');
		}

		// Replace all instances of something enclosed in square brackets with its corresponding string in the ids parameter
		let url = `${defaultUrl}${route}`;
		for (const key in params) {
			if (params[key] !== undefined && key !== 'searchParams') {
				url = url.replace(`[${key}]`, params[key] as string);
			}
		}
		// Append the search params to the URL
		if (params && params.searchParams) {
			url = url + `?${params.searchParams}`;
		}

		return axios.get(url, config);
	}
}

// Create an instance
const sbAxios: SBAxios = new SBAxios();

// Export the instance
export default sbAxios;