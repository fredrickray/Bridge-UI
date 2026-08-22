import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { AgreementCard } from '@/components/agreements/agreement-card'
import { AgreementsEmpty } from '@/components/agreements/agreements-empty'
import { AgreementsPagination } from '@/components/agreements/agreements-pagination'
import { AgreementsSearchField } from '@/components/agreements/agreements-search-field'
import { AgreementsStatusSelect } from '@/components/agreements/agreements-status-select'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { CATALOG_AGREEMENTS } from '@/lib/agreement/catalog'
import {
  AGREEMENT_PAGE_SIZE,
  agreementsSearchParams,
  filterAgreementSummaries,
  parseAgreementsSearch,
  summaryFromCreated,
} from '@/lib/agreement/list'
import type { AgreementStatus, AgreementsSearch } from '@/lib/agreement/list'

export const Route = createFileRoute('/(app)/_layout/agreements/')({
  validateSearch: (search: Record<string, unknown>): AgreementsSearch =>
    parseAgreementsSearch(search),
  component: AgreementsPage,
})

function AgreementsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/agreements/' })
  const { agreements } = useAgreementDraftContext()
  const query = search.q ?? ''
  const status = search.status
  const created = Object.values(agreements).map(summaryFromCreated)
  const items = [...created, ...CATALOG_AGREEMENTS].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
  const filtered = filterAgreementSummaries(items, query, status)
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / AGREEMENT_PAGE_SIZE),
  )
  const page = Math.min(search.page ?? 1, totalPages)
  const pageItems = filtered.slice(
    (page - 1) * AGREEMENT_PAGE_SIZE,
    page * AGREEMENT_PAGE_SIZE,
  )
  const filtersActive = Boolean(query) || Boolean(status)

  function updateSearch(next: AgreementsSearch) {
    void navigate({
      search: agreementsSearchParams(next),
      replace: true,
    })
  }

  return (
    <AppPadding className="flex flex-1 flex-col gap-4 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          Agreements
        </h1>
        <p className="text-sm text-muted-foreground">
          Escrow deals in flight. Search, filter, and open any agreement.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <AgreementsSearchField
          className="w-full max-w-[450px]"
          value={query}
          onChange={(nextQuery) =>
            updateSearch({ ...search, q: nextQuery, page: undefined })
          }
        />
        <AgreementsStatusSelect
          className="sm:w-[calc(13rem*2/3)]"
          value={status}
          onChange={(nextStatus: AgreementStatus | undefined) =>
            updateSearch({ ...search, status: nextStatus, page: undefined })
          }
        />
      </div>

      {pageItems.length === 0 ? (
        <AgreementsEmpty filtersActive={filtersActive} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      )}

      <AgreementsPagination
        page={page}
        totalPages={totalPages}
        search={{ q: search.q, status }}
      />
    </AppPadding>
  )
}
