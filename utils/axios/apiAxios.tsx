/*
 Axios instance that extends the default Axios instance to include a method for sending GET requests to a specified route and returning a typed response.
 */

import {CourseModulesResponse, CourseResponse, CoursesResponse} from "@/types/api/courses/types";
import {ModuleResponse, ModulesResponse} from "@/types/api/modules/types";
import {PostResponse, PostsResponse} from "@/types/api/posts/types";
import {ProfileResponse} from "@/types/api/profiles/types";
import {UserModulesResponse} from "@/types/api/user/tyoes";
import axios, {Axios, AxiosRequestConfig, AxiosResponse} from "axios";
import {ArticlesResponse} from "@/types/api/articles/types";
import {DraftsResponse} from "@/types/api/drafts/types";
import {TopicsResponse} from "@/types/api/topics/types";


export type GetRouteResponseMap = {
	'/api/courses': CoursesResponse,
	'/api/courses/[id]': CourseResponse,
	'/api/courses/[id]/modules': CourseModulesResponse,
	'/api/modules': ModulesResponse,
	'/api/modules/[id]': ModuleResponse,
	'/api/posts/[id]': PostResponse,
	'/api/posts': PostsResponse,
	'/api/profiles/[id]': ProfileResponse,
	'/api/user/modules': UserModulesResponse,
	'/api/articles': ArticlesResponse,
	'/api/drafts': DraftsResponse,
	'/api/topics': TopicsResponse
};

export type Params = {
	searchParams?: string;
	[key: string]: string | undefined;
}

class APIAxios {
	private axiosInstance: typeof Axios.prototype;
	constructor(config?: AxiosRequestConfig) {
		this.axiosInstance = axios.create(config);

	}

	/**
	 * This method is used to send a GET request to a specified route and return a typed response.
	 * The route is specified as a key of the RouteResponseMap type, and the ids parameter is used to replace placeholders in the route.
	 *
	 * @template Route - The route type, which should be a key of GetRouteResponseMap.
	 * @param {Route} route - The route to which the GET request should be sent.
	 * @param {Params} params - An object where the keys are the parameter names and the values are the parameter
	 * values, which will be used to replace placeholders in the route and append search parameters to the URL.
	 * @param {AxiosRequestConfig} [config] - Optional configuration for the axios request.
	 * @returns {Promise<AxiosResponse<GetRouteResponseMap[Route]>>} - A Promise that resolves to the response of the GET request.
	 *
	 * @example
	 * // Send a GET request to the '/api/courses/[id]' route, replacing '[id]' with '33'
	 * apiAxios.get('/api/courses/[id]', { id: '33' })
	 *   .then(response => {
	 *     // Handle the response
	 *     console.log(response.data);
	 *   })
	 *   .catch(error => {
	 *     // Handle the error
	 *     console.error(error);
	 *   });
	 */
	async get<Route extends keyof GetRouteResponseMap>(
		route: Route,
		params?: Params,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<GetRouteResponseMap[Route]>> {

		const isRelativeUrl = (url: string) => {return !(/^(?:[a-z]+:)?\/\//i.test(url));}

		if (!isRelativeUrl(route as string)) {
			throw new Error('(apiAxios): Route must be a relative URL.');
		}

		let defaultURL: string;

		if (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) {
			defaultURL = `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
		} else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
			defaultURL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
		} else {
			defaultURL = 'http://localhost:3000';
		}

		// Replace all instances of something enclosed in square brackets with its corresponding string in the ids parameter
		let url = `${defaultURL}${route}`;
		for (const key in params) {
			if (params[key] !== undefined && key !== 'searchParams') {
				url = url.replace(`[${key}]`, params[key] as string);
			}
		}
		// Append the search params to the URL
		if (params && params.searchParams) {
			url = url + `?${params.searchParams}`;
		}

		return this.axiosInstance.get(url, config);
	}
}

const apiAxios: APIAxios = new APIAxios();

// Export the instance
export default apiAxios;