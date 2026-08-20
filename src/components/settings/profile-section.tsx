import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon, UserRoundIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { SettingsPanel } from '@/components/settings/settings-shell'
import { initials } from '@/components/shared/app-shell/user'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TIMEZONE_OPTIONS,
  profileSchema,
  type ProfileValues,
} from '@/lib/auth/profile-schemas'
import { updateProfile, type AuthUser } from '@/lib/auth/session'

type ProfileSectionProps = {
  user: AuthUser
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [pending, setPending] = useState(false)
  const timezoneOptions = useMemo(() => {
    return Array.from(new Set([user.timezone, ...TIMEZONE_OPTIONS])).filter(Boolean)
  }, [user.timezone])

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user.fullName,
      phone: user.phone,
      company: user.company,
      timezone: user.timezone || 'UTC',
    },
  })

  async function onSubmit(values: ProfileValues) {
    setPending(true)
    try {
      await updateProfile(values)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update profile')
    } finally {
      setPending(false)
    }
  }

  const displayName = form.watch('fullName') || user.fullName || 'U'

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingsPanel
        icon={<UserRoundIcon />}
        title="Public profile"
        description="This is how payers and providers see you on agreements and invites."
        footer={
          <Button
            type="submit"
            className="active:scale-[0.97]"
            disabled={pending || !form.formState.isDirty}
          >
            {pending ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Save profile
          </Button>
        }
      >
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 font-heading text-lg font-medium text-primary ring-1 ring-primary/20">
            {initials(displayName)}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-heading text-sm font-medium">Avatar</p>
            <p className="text-sm text-muted-foreground">
              Initials update from your name. Photo upload arrives with the API.
            </p>
          </div>
        </div>

        <FieldGroup className="gap-5 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
          <Field
            className="sm:col-span-2"
            data-invalid={!!form.formState.errors.fullName || undefined}
          >
            <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
            <Input
              id="profile-name"
              autoComplete="name"
              className="h-10"
              aria-invalid={!!form.formState.errors.fullName || undefined}
              {...form.register('fullName')}
            />
            <FieldError errors={[form.formState.errors.fullName]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.phone || undefined}>
            <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
            <Input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              className="h-10"
              aria-invalid={!!form.formState.errors.phone || undefined}
              {...form.register('phone')}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.company || undefined}>
            <FieldLabel htmlFor="profile-company">Company</FieldLabel>
            <Input
              id="profile-company"
              autoComplete="organization"
              placeholder="Optional"
              className="h-10"
              aria-invalid={!!form.formState.errors.company || undefined}
              {...form.register('company')}
            />
            <FieldError errors={[form.formState.errors.company]} />
          </Field>

          <Controller
            control={form.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <Field
                className="sm:col-span-2"
                data-invalid={!!fieldState.error || undefined}
              >
                <FieldLabel htmlFor="profile-timezone">Timezone</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value != null) field.onChange(value)
                  }}
                >
                  <SelectTrigger id="profile-timezone" className="h-10 w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timezoneOptions.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone.replaceAll('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </SettingsPanel>
    </form>
  )
}
