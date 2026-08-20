import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRoundIcon, LoaderCircleIcon, MailIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/auth/password-input'
import { SettingsPanel } from '@/components/settings/settings-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  emailSchema,
  passwordChangeSchema,
  type EmailValues,
  type PasswordChangeValues,
} from '@/lib/auth/profile-schemas'
import { changePassword, updateEmail, type AuthUser } from '@/lib/auth/session'

type AccountSectionProps = {
  user: AuthUser
}

export function AccountSection({ user }: AccountSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <EmailCard user={user} />
      <PasswordCard />
    </div>
  )
}

function EmailCard({ user }: AccountSectionProps) {
  const [pending, setPending] = useState(false)
  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    values: { email: user.email },
  })

  async function onSubmit(values: EmailValues) {
    setPending(true)
    try {
      const next = await updateEmail(values.email)
      toast.success(
        next.verified
          ? 'Email updated'
          : 'Email updated — verify it on the next sign-in',
      )
      form.reset({ email: next.email })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update email')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingsPanel
        icon={<MailIcon />}
        title="Email address"
        description="Used for invitations, funding alerts, and account recovery."
        footer={
          <Button
            type="submit"
            className="active:scale-[0.97]"
            disabled={pending || !form.formState.isDirty}
          >
            {pending ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Update email
          </Button>
        }
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Badge variant={user.verified ? 'secondary' : 'outline'}>
            {user.verified ? 'Verified' : 'Needs verification'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Changing email marks the account unverified until confirmed.
          </span>
        </div>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email || undefined}>
            <FieldLabel htmlFor="account-email">Email</FieldLabel>
            <Input
              id="account-email"
              type="email"
              autoComplete="email"
              className="h-10"
              aria-invalid={!!form.formState.errors.email || undefined}
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
        </FieldGroup>
      </SettingsPanel>
    </form>
  )
}

function PasswordCard() {
  const [pending, setPending] = useState(false)
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: PasswordChangeValues) {
    setPending(true)
    try {
      await changePassword(values.currentPassword, values.password)
      toast.success('Password updated')
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to change password')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingsPanel
        icon={<KeyRoundIcon />}
        title="Password"
        description="Use at least 8 characters with one uppercase letter and one number."
        footer={
          <Button type="submit" className="active:scale-[0.97]" disabled={pending}>
            {pending ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Update password
          </Button>
        }
      >
        <FieldGroup className="gap-5 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
          <Field
            className="sm:col-span-2"
            data-invalid={!!form.formState.errors.currentPassword || undefined}
          >
            <FieldLabel htmlFor="current-password">Current password</FieldLabel>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              invalid={!!form.formState.errors.currentPassword}
              {...form.register('currentPassword')}
            />
            <FieldError errors={[form.formState.errors.currentPassword]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.password || undefined}>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
            <FieldDescription>Must match the new password.</FieldDescription>
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
        </FieldGroup>
      </SettingsPanel>
    </form>
  )
}
