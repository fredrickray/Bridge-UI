import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/auth/schemas'
import { resetPassword } from '@/lib/auth/session'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordValues) {
    setPending(true)
    try {
      await resetPassword(values.password)
      toast.success('Password updated')
      await navigate({ to: '/login' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reset password')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="Use at least 8 characters with one uppercase letter and one number."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.password || undefined}>
            <FieldLabel htmlFor="reset-password">New password</FieldLabel>
            <PasswordInput
              id="reset-password"
              autoComplete="new-password"
              placeholder="New password"
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="reset-confirm">Confirm password</FieldLabel>
            <PasswordInput
              id="reset-confirm"
              autoComplete="new-password"
              placeholder="Repeat password"
              invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : null}
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
