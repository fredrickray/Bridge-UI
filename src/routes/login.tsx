import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthLayout } from '@/components/auth/auth-layout'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginValues } from '@/lib/auth/schemas'
import { loginWithEmail } from '@/lib/auth/session'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginValues) {
    setPending(true)
    try {
      await loginWithEmail(values.email, values.password)
      toast.success('Welcome back')
      await navigate({ to: '/workspace' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Access your escrow agreements, milestones, and releases."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New to Bridge?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <GoogleAuthButton />
        <FieldSeparator>or continue with email</FieldSeparator>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email || undefined}>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="h-10"
              aria-invalid={!!form.formState.errors.email || undefined}
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.password || undefined}>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="••••••••"
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
