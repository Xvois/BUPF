'use client'

import React from "react";
import {
    Pagination,
    PaginationButton,
    PaginationButtonNext,
    PaginationButtonPrevious,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
    children: React.ReactNode[];
}

/**
* A wrapper that paginates its children, such that only one child is visible at a time.
 *
 * @example
 * <PaginationWrapper>
 *     <div>Page 1</div>
 *     <div>Page 2</div>
 *     <div>Page 3</div>
 * </PaginationWrapper>
 */
export default function PaginationWrapper({children}: PaginationWrapperProps) {
    const [page, setPage] = React.useState(1);
    const pages = children.length;

    return (
        <>
            {children[page - 1]}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationButtonPrevious disabled={page === 1} onClick={() => setPage(page => page - 1)}/>
                    </PaginationItem>
                    {
                        page - 1 > 1 &&
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                    }
                    {page > 1 &&
                        <PaginationItem>
                            <PaginationButton onClick={() => setPage(page => page - 1)}>
                                {page - 1}
                            </PaginationButton>
                        </PaginationItem>
                    }
                    <PaginationItem>
                        <PaginationButton isActive>
                            {page}
                        </PaginationButton>
                    </PaginationItem>
                    {
                        page < pages &&
                        <PaginationItem>
                            <PaginationButton onClick={() => setPage(page => page + 1)}>
                                {page + 1}
                            </PaginationButton>
                        </PaginationItem>
                    }
                    {
                        page + 1 < pages &&
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                    }

                    <PaginationItem>
                        <PaginationButtonNext disabled={page === pages}
                                              onClick={() => setPage(page => page + 1)}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}