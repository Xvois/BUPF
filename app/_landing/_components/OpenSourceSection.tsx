'use client'

import {h2, subtle_p} from "@/styles/text";
import {cn} from "@/utils/cn";
import EmSubtle from "@/components/EmSubtle";
import React, {useEffect, useRef} from "react";
import {useActiveSection} from "@/components/DynamicSections";
import ExtLink from "@/components/ExtLink";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import {calcMaxCharacters} from "@/utils/trunc";

const safeSnippet = ` 
'use client'

import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {cn} from "@/utils/cn";


type ActiveSectionContextType = \{
    activeSection: number;
    registerSection: (ref: HTMLDivElement) => void;
    getSectionIndex: (ref: HTMLDivElement | null) => number;
    sectionRefs: React.MutableRefObject<HTMLDivElement[]>;
\};

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);

export const useActiveSection = () => {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw new Error('useActiveSection must be used within a ActiveSectionProvider');
    }
    return context;
};

const ActiveSectionProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [activeSection, setActiveSection] = useState(-1);
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
                    if (entry.isIntersecting && index !== -1) {
                        setActiveSection(index);
                    }
                });
            },
            {threshold: 0.75}
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const registerSection = (ref: HTMLDivElement) => {
        if (ref && !sectionRefs.current.includes(ref)) {
            sectionRefs.current.push(ref);
        }
    };

    const getSectionIndex = (ref: HTMLDivElement | null) => {
        if (!ref) return -1;
        return sectionRefs.current.indexOf(ref);
    }

    return (
        <ActiveSectionContext.Provider value=\{{activeSection, registerSection, getSectionIndex, sectionRefs}}>
            {children}
        </ActiveSectionContext.Provider>
    );
};

type DynamicSectionsProps = \{
    children: ReactElement[];
\} & React.HTMLAttributes<HTMLDivElement>;


export default function DynamicSections({children, ...props}: DynamicSectionsProps) {
    return (
        <ActiveSectionProvider>
            <div {...props}>
                {children}
            </div>
        </ActiveSectionProvider>
    );
}

export const fetcher = async <Route extends keyof GetRouteResponseMap>(
    url: Route,
    params?: Params,
    config?: AxiosRequestConfig
): Promise<GetRouteResponseMap[Route]> => {
    const response = await apiAxios.get(url, params, config);
    if (!response.data) throw new Error("No data");
    return response.data;
}

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function GET(request: Request) {
\tconst client = createAdminClient();

\tconst params = new URL(request.url).searchParams;

\tlet query = client.from("posts").select("*, profiles (*, courses (*))").eq("type", "article");

\tconst filtersString = params.get("filters");
\tif (filtersString) {
\t\tconst filters = JSON.parse(filtersString);
\t\tfilters.forEach((filter: any) => {
\t\t\tif (Array.isArray(filter.value)) {
\t\t\t\tfilter.value = toPostgresList(filter.value);
\t\t\t}
\t\t\tquery.filter(filter.column, filter.operator, filter.value);
\t\t});
\t}

\tconst sort = params.get("sort");
\tif (sort) {
\t\tconst JSONSort = JSON.parse(sort);
\t\tquery = query.order("created_at", JSONSort);
\t}

\tconst response: ArticlesResponse = await query;

\treturn Response.json(response);
}
`

const bunchedSnippet = safeSnippet.replace(/\s+/g, ' ');


export default function OpenSourceSection() {

    const {activeSection, registerSection, getSectionIndex} = useActiveSection();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerSection(ref.current);
        }
    }, [registerSection]);

    const isActive = activeSection === getSectionIndex(ref.current);

    const maxCharacters = ref.current && calcMaxCharacters(ref.current.clientWidth, ref.current.clientHeight, 12);
    const numOfSnippets = maxCharacters && Math.ceil(maxCharacters / bunchedSnippet.length);
    const fittingSnippet = numOfSnippets && bunchedSnippet.repeat(numOfSnippets);

    return (
        <section
            className={"relative flex flex-col text-center w-full h-screen items-center align-middle justify-center"}
            ref={ref}>
            <div>
                <h2 className={cn(h2, "z-10")}>
                    Open for all
                </h2>
                <p className={subtle_p}>
                    Open source on <EmSubtle><ExtLink
                    href={"https://github.com/Xvois/BUPF"}>Github</ExtLink></EmSubtle>,
                    this is a project made <EmSubtle>by students for students</EmSubtle>.
                </p>
            </div>
            <div className={"absolute top-0 left-0 w-full h-full text-justify overflow-hidden text-xs -z-10"}>
                <MarkdownRender className={cn("absolute top-0 left-0 w-full opacity-25")}>
                    {'~~~tsx \n' + fittingSnippet}
                </MarkdownRender>
            </div>
        </section>
    )
}