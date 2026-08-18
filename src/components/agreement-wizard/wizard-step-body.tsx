import { DocumentsFields } from '@/components/agreement-wizard/documents-section'
import { MilestonesFields } from '@/components/agreement-wizard/milestones-section'
import { ReviewSection } from '@/components/agreement-wizard/review-section'
import {
  DetailsFields,
  FundingFields,
  RoleFields,
  StepIntro,
  TermsFields,
} from '@/components/agreement-wizard/sections'
import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { WIZARD_STEPS, stepIsOptional } from '@/lib/agreement/draft'
import type { WizardStepId } from '@/lib/agreement/draft'

export function WizardStepBody({
  step,
  showIntro = true,
  showErrors = false,
}: {
  step: WizardStepId
  showIntro?: boolean
  showErrors?: boolean
}) {
  const {
    draft,
    patch,
    addMilestone,
    updateMilestone,
    removeMilestone,
    moveMilestone,
    addDocument,
    removeDocument,
  } = useAgreementDraftContext()

  const meta = WIZARD_STEPS.find((item) => item.id === step)

  return (
    <div className="flex flex-col gap-6">
      {showIntro && meta ? (
        <StepIntro
          title={stepIsOptional(meta) ? `${meta.label} (Optional)` : meta.label}
          goal={meta.goal}
        />
      ) : null}
      {step === 'role' ? (
        <RoleFields draft={draft} patch={patch} showErrors={showErrors} />
      ) : null}
      {step === 'details' ? (
        <DetailsFields draft={draft} patch={patch} showErrors={showErrors} />
      ) : null}
      {step === 'milestones' ? (
        <MilestonesFields
          draft={draft}
          addMilestone={addMilestone}
          updateMilestone={updateMilestone}
          removeMilestone={removeMilestone}
          moveMilestone={moveMilestone}
          showErrors={showErrors}
        />
      ) : null}
      {step === 'funding' ? (
        <FundingFields draft={draft} patch={patch} showErrors={showErrors} />
      ) : null}
      {step === 'terms' ? (
        <TermsFields draft={draft} patch={patch} showErrors={showErrors} />
      ) : null}
      {step === 'documents' ? (
        <DocumentsFields
          draft={draft}
          addDocument={addDocument}
          removeDocument={removeDocument}
        />
      ) : null}
      {step === 'review' ? <ReviewSection draft={draft} /> : null}
    </div>
  )
}
