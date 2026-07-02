import { createFileRoute, redirect } from '@tanstack/react-router'

import { HowItWorks } from '@/components/landing/how-it-works'
import { LandingCta } from '@/components/landing/landing-cta'
import { LandingFooter } from '@/components/landing/landing-footer'
import { LandingHero } from '@/components/landing/landing-hero'
import { LandingNav } from '@/components/landing/landing-nav'
import { TrustSection } from '@/components/landing/trust-section'
import { getAuthState } from '@/lib/auth/session'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { token } = getAuthState()
    if (token) {
      throw redirect({ to: '/workspace' })
    }
  },
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <HowItWorks />
        <TrustSection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}
