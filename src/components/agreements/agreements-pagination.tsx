import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { agreementsSearchParams } from '@/lib/agreement/list'
import type { AgreementsSearch } from '@/lib/agreement/list'
import { paginationRange } from '@/utils/list/pagination-range'

export function AgreementsPagination({
  page,
  totalPages,
  search,
}: {
  page: number
  totalPages: number
  search: AgreementsSearch
}) {
  if (totalPages <= 1) return null

  const pages = paginationRange(page, totalPages)

  function pageSearch(nextPage: number): AgreementsSearch {
    return agreementsSearchParams({ ...search, page: nextPage })
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2">
      <div className="hidden sm:block" />
      <Pagination className="mx-0 w-auto justify-center">
        <PaginationContent>
          {pages.map((item, index) =>
            item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  variant={item === page ? 'outline' : 'ghost'}
                  size="icon"
                  nativeButton={false}
                  render={<Link to="/agreements" search={pageSearch(item)} />}
                  aria-current={item === page ? 'page' : undefined}
                >
                  {item}
                </Button>
              </PaginationItem>
            ),
          )}
        </PaginationContent>
      </Pagination>
      <div className="flex w-full justify-end gap-1 sm:w-auto">
        {page <= 1 ? (
          <Button variant="ghost" size="default" disabled className="pl-1.5">
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="default"
            className="pl-1.5"
            nativeButton={false}
            render={<Link to="/agreements" search={pageSearch(page - 1)} />}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Button>
        )}
        {page >= totalPages ? (
          <Button variant="ghost" size="default" disabled className="pr-1.5">
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="default"
            className="pr-1.5"
            nativeButton={false}
            render={<Link to="/agreements" search={pageSearch(page + 1)} />}
          >
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
