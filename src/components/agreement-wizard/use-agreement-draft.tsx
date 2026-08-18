import { createContext, use, useReducer, useState } from 'react'
import type { ReactNode } from 'react'

import {
  createEmptyDraft,
  createMilestone,
  createSampleDraft,
} from '@/lib/agreement/draft'
import type {
  AgreementDocument,
  AgreementDraft,
  DocumentKind,
  Milestone,
} from '@/lib/agreement/draft'

type InviteState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; sentAt: string }

type CreateState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; id: string }

export type CreatedAgreement = {
  id: string
  draft: AgreementDraft
  createdAt: string
  invitedAt: string | null
}

type DraftAction =
  | { type: 'replace'; draft: AgreementDraft }
  | { type: 'patch'; patch: Partial<AgreementDraft> }
  | { type: 'addMilestone'; milestone: Milestone }
  | { type: 'updateMilestone'; id: string; patch: Partial<Milestone> }
  | { type: 'removeMilestone'; id: string }
  | { type: 'moveMilestone'; id: string; direction: 'up' | 'down' }
  | {
      type: 'addDocument'
      kind: DocumentKind
      name: string
      description: string
    }
  | { type: 'updateDocument'; id: string; patch: Partial<AgreementDocument> }
  | { type: 'removeDocument'; id: string }

function draftReducer(
  state: AgreementDraft,
  action: DraftAction,
): AgreementDraft {
  switch (action.type) {
    case 'replace':
      return action.draft
    case 'patch':
      return { ...state, ...action.patch }
    case 'addMilestone':
      return { ...state, milestones: [...state.milestones, action.milestone] }
    case 'updateMilestone':
      return {
        ...state,
        milestones: state.milestones.map((milestone) =>
          milestone.id === action.id
            ? { ...milestone, ...action.patch }
            : milestone,
        ),
      }
    case 'removeMilestone':
      return {
        ...state,
        milestones: state.milestones.filter(
          (milestone) => milestone.id !== action.id,
        ),
      }
    case 'moveMilestone': {
      const index = state.milestones.findIndex(
        (milestone) => milestone.id === action.id,
      )
      const nextIndex = action.direction === 'up' ? index - 1 : index + 1
      if (index < 0 || nextIndex < 0 || nextIndex >= state.milestones.length) {
        return state
      }
      const milestones = [...state.milestones]
      const [moved] = milestones.splice(index, 1)
      milestones.splice(nextIndex, 0, moved)
      return { ...state, milestones }
    }
    case 'addDocument':
      return {
        ...state,
        documents: [
          ...state.documents,
          {
            id: crypto.randomUUID(),
            kind: action.kind,
            name: action.name,
            description: action.description,
          },
        ],
      }
    case 'updateDocument':
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === action.id
            ? { ...document, ...action.patch }
            : document,
        ),
      }
    case 'removeDocument':
      return {
        ...state,
        documents: state.documents.filter(
          (document) => document.id !== action.id,
        ),
      }
  }
}

function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useAgreementDraft() {
  const [draft, dispatch] = useReducer(
    draftReducer,
    undefined,
    createEmptyDraft,
  )
  const [invite, setInvite] = useState<InviteState>({ status: 'idle' })
  const [create, setCreate] = useState<CreateState>({ status: 'idle' })
  const [agreements, setAgreements] = useState<
    Record<string, CreatedAgreement>
  >({})

  function patch(next: Partial<AgreementDraft>) {
    dispatch({ type: 'patch', patch: next })
  }

  async function createAgreement() {
    setCreate({ status: 'loading' })
    try {
      await delay()
      const id = crypto.randomUUID()
      const created: CreatedAgreement = {
        id,
        draft,
        createdAt: new Date().toISOString(),
        invitedAt: null,
      }
      setAgreements((current) => ({ ...current, [id]: created }))
      setCreate({ status: 'success', id })
      return created
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create the agreement.'
      setCreate({ status: 'error', message })
      throw error
    }
  }

  async function sendInvite(agreementId: string) {
    setInvite({ status: 'loading' })
    try {
      await delay()
      const sentAt = new Date().toISOString()
      setAgreements((current) => {
        const existing = current[agreementId]
        if (!existing) return current
        return {
          ...current,
          [agreementId]: { ...existing, invitedAt: sentAt },
        }
      })
      setInvite({ status: 'success', sentAt })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to send the invitation.'
      setInvite({ status: 'error', message })
      throw error
    }
  }

  function reset() {
    dispatch({ type: 'replace', draft: createEmptyDraft() })
    setInvite({ status: 'idle' })
    setCreate({ status: 'idle' })
  }

  function loadSample() {
    dispatch({ type: 'replace', draft: createSampleDraft() })
    setInvite({ status: 'idle' })
  }

  return {
    draft,
    invite,
    create,
    agreements,
    patch,
    addMilestone: () => {
      const milestone = createMilestone()
      dispatch({ type: 'addMilestone', milestone })
      return milestone.id
    },
    updateMilestone: (id: string, next: Partial<Milestone>) =>
      dispatch({ type: 'updateMilestone', id, patch: next }),
    removeMilestone: (id: string) => dispatch({ type: 'removeMilestone', id }),
    moveMilestone: (id: string, direction: 'up' | 'down') =>
      dispatch({ type: 'moveMilestone', id, direction }),
    addDocument: (kind: DocumentKind, name: string, description: string) =>
      dispatch({ type: 'addDocument', kind, name, description }),
    updateDocument: (id: string, next: Partial<AgreementDocument>) =>
      dispatch({ type: 'updateDocument', id, patch: next }),
    removeDocument: (id: string) => dispatch({ type: 'removeDocument', id }),
    sendInvite,
    createAgreement,
    resetInvite: () => setInvite({ status: 'idle' }),
    reset,
    loadSample,
  }
}

export type AgreementDraftApi = ReturnType<typeof useAgreementDraft>

const AgreementDraftContext = createContext<AgreementDraftApi | null>(null)

export function AgreementDraftProvider({ children }: { children: ReactNode }) {
  const api = useAgreementDraft()
  return (
    <AgreementDraftContext.Provider value={api}>
      {children}
    </AgreementDraftContext.Provider>
  )
}

export function useAgreementDraftContext() {
  const api = use(AgreementDraftContext)
  if (!api) {
    throw new Error(
      'useAgreementDraftContext must be used within AgreementDraftProvider',
    )
  }
  return api
}

export type { InviteState }
