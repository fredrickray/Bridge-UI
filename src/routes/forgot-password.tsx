import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { forgotPasswordSchema  } from '@/lib/auth/schemas'
import type {ForgotPasswordValues} from '@/lib/auth/schemas';
import { requestPasswordReset } from '@/lib/auth/session'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setPending(true)
    try {
      await requestPasswordReset(values.email)
      toast.success('Reset link sent — continue to set a new password')
      await navigate({ to: '/reset-password' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send reset email')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email on your account and we'll send a reset link."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email || undefined}>
            <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="h-10"
              aria-invalid={!!form.formState.errors.email || undefined}
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : null}
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  )
}
