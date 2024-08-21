import apiAxios, {GetRouteResponseMap, Params} from "@/utils/axios/apiAxios";
import {AxiosRequestConfig} from "axios";

export const fetcher = async <Route extends keyof GetRouteResponseMap>(
    url: Route,
    params?: Params,
    config?: AxiosRequestConfig
): Promise<GetRouteResponseMap[Route]> => {
    const response = await apiAxios.get(url, params, config);
    if (!response.data) throw new Error("No data");
    return response.data;
}