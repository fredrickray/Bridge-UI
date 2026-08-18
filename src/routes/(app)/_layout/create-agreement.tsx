import { createFileRoute } from '@tanstack/react-router'

import { MistWizard } from '@/components/agreement-wizard/mist-wizard'

export const Route = createFileRoute('/(app)/_layout/create-agreement')({
  component: CreateAgreementPage,
})

function CreateAgreementPage() {
  return (
    <div className="h-full min-h-0">
      <MistWizard />
    </div>
  )
}
