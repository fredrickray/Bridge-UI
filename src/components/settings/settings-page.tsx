import {
  BellIcon,
  KeyRoundIcon,
  ShieldAlertIcon,
  UserRoundIcon,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { AccountSection } from '@/components/settings/account-section'
import { DangerSection } from '@/components/settings/danger-section'
import { NotificationsSection } from '@/components/settings/notifications-section'
import { ProfileSection } from '@/components/settings/profile-section'
import {
  SettingsIdentity,
  SettingsTabMotion,
} from '@/components/settings/settings-shell'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { initials } from '@/components/shared/app-shell/user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthState } from '@/lib/auth/session'

const easeOut = [0.23, 1, 0.32, 1] as const

const TABS = [
  { value: 'profile', label: 'Profile', icon: UserRoundIcon },
  { value: 'account', label: 'Account', icon: KeyRoundIcon },
  { value: 'notifications', label: 'Notifications', icon: BellIcon },
] as const

export function SettingsPage() {
  const { user } = useAuthState()
  const reduceMotion = useReducedMotion()

  if (!user) {
    return null
  }

  return (
    <AppPadding className="flex flex-1 flex-col gap-6 pb-10">
      <motion.div
        className="flex flex-col gap-1"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
      >
        <p className="font-heading text-xs font-medium tracking-[0.14em] text-primary uppercase">
          Your Bridge identity
        </p>
        <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-[1.75rem]">
          Profile & account
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground text-pretty">
          Control how you appear on agreements, secure your sign-in, and choose
          which escrow events reach you.
        </p>
      </motion.div>

      <SettingsIdentity
        name={user.fullName}
        email={user.email}
        company={user.company}
        verified={user.verified}
        initials={initials(user.fullName || user.email)}
      />

      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="grid w-full gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start"
      >
        <TabsList
          variant="default"
          className="h-auto w-full flex-row justify-start gap-1 overflow-x-auto p-1 lg:flex-col lg:items-stretch"
        >
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="justify-start gap-2 px-3 py-2 data-active:shadow-sm lg:w-full"
            >
              <tab.icon data-icon="inline-start" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0">
          <TabsContent value="profile" className="mt-0 outline-none">
            <SettingsTabMotion>
              <ProfileSection user={user} />
              <DangerSection />
            </SettingsTabMotion>
          </TabsContent>

          <TabsContent value="account" className="mt-0 outline-none">
            <SettingsTabMotion>
              <AccountSection user={user} />
            </SettingsTabMotion>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 outline-none">
            <SettingsTabMotion>
              <NotificationsSection user={user} />
            </SettingsTabMotion>
          </TabsContent>
        </div>
      </Tabs>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldAlertIcon className="size-3.5" />
        Profile changes apply across invitations and agreements once saved.
      </p>
    </AppPadding>
  )
}
