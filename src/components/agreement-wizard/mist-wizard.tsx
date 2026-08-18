import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { InviteDialog } from '@/components/agreement-wizard/invite-section'
import {
  LinkedStepHeader,
  WizardFooter,
  WizardShell,
  WizardStepRail,
  useWizardPager,
} from '@/components/agreement-wizard/wizard-chrome'
import { WizardStepBody } from '@/components/agreement-wizard/wizard-step-body'
import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'

export function MistWizard() {
  const navigate = useNavigate()
  const {
    draft,
    invite,
    create,
    agreements,
    createAgreement,
    sendInvite,
    resetInvite,
    reset,
    loadSample,
  } = useAgreementDraftContext()
  const { index, step, passed, setIndex, goNext, goBack, showErrors } =
    useWizardPager(draft)
  const [inviteOpen, setInviteOpen] = useState(false)
  const agreementId = create.status === 'success' ? create.id : null
  const agreement = agreementId ? agreements[agreementId] : null

  async function handleNext() {
    if (create.status === 'loading') return
    if (create.status === 'success') {
      setInviteOpen(true)
      return
    }
    const result = goNext()
    if (result !== 'finished') return
    try {
      resetInvite()
      await createAgreement()
      setInviteOpen(true)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to create the agreement',
      )
    }
  }

  function goToAgreement() {
    if (!agreementId) return
    setInviteOpen(false)
    reset()
    void navigate({
      to: '/agreements/$agreementId',
      params: { agreementId },
    })
  }

  async function handleSend() {
    if (!agreementId) return
    try {
      await sendInvite(agreementId)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to send the invitation',
      )
    }
  }

  return (
    <>
      <WizardShell
        stepKey={step.id}
        rail={
          <WizardStepRail
            currentIndex={index}
            draft={draft}
            passed={passed}
            onSelect={setIndex}
          />
        }
        header={
          <LinkedStepHeader
            currentIndex={index}
            draft={draft}
            passed={passed}
            onSelect={setIndex}
          />
        }
        headerClassName="lg:hidden"
        footer={
          <WizardFooter
            index={index}
            onBack={goBack}
            onNext={() => void handleNext()}
            onPrefill={loadSample}
            showHint={showErrors}
            pending={create.status === 'loading'}
          />
        }
      >
        <WizardStepBody step={step.id} showErrors={showErrors} />
      </WizardShell>
      <InviteDialog
        open={inviteOpen}
        agreement={agreement ?? null}
        invite={invite}
        onSkip={goToAgreement}
        onSend={() => void handleSend()}
        onGoToAgreement={goToAgreement}
      />
    </>
  )
}
