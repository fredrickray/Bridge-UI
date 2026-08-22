import { Link } from '@tanstack/react-router'
import { FolderKanbanIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function AgreementsEmpty({ filtersActive }: { filtersActive: boolean }) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderKanbanIcon />
        </EmptyMedia>
        <EmptyTitle>
          {filtersActive ? 'No matching agreements' : 'No agreements yet'}
        </EmptyTitle>
        <EmptyDescription>
          {filtersActive
            ? 'Try a different name or status, or clear the current filters.'
            : 'Create an agreement to see it listed here.'}
        </EmptyDescription>
      </EmptyHeader>
      {filtersActive ? (
        <EmptyContent>
          <Button
            render={<Link to="/agreements" search={{}} />}
            nativeButton={false}
          >
            Clear filters
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
