import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AuthLayout } from '@/components/auth/auth-layout'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signupSchema  } from '@/lib/auth/schemas'
import type {SignupValues} from '@/lib/auth/schemas';
import { signupWithEmail } from '@/lib/auth/session'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  async function onSubmit(values: SignupValues) {
    setPending(true)
    try {
      await signupWithEmail(values.fullName, values.email, values.password)
      toast.success('Check your inbox for a verification code')
      await navigate({
        to: '/verify',
        search: { email: values.email },
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create account')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Set up Bridge to create agreements, fund milestones, and release with confidence."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
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
        <GoogleAuthButton label="Sign up with Google" />
        <FieldSeparator>or continue with email</FieldSeparator>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.fullName || undefined}>
            <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
            <Input
              id="signup-name"
              autoComplete="name"
              placeholder="Ada Okonkwo"
              className="h-10"
              aria-invalid={!!form.formState.errors.fullName || undefined}
              {...form.register('fullName')}
            />
            <FieldError errors={[form.formState.errors.fullName]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.email || undefined}>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              id="signup-email"
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
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <PasswordInput
              id="signup-password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="signup-confirm">Confirm password</FieldLabel>
            <PasswordInput
              id="signup-confirm"
              autoComplete="new-password"
              placeholder="Repeat password"
              invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>

          <Controller
            control={form.control}
            name="acceptTerms"
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={!!fieldState.error || undefined}
              >
                <Checkbox
                  id="signup-terms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={!!fieldState.error || undefined}
                />
                <FieldLabel htmlFor="signup-terms" className="font-normal">
                  I agree to the Terms of Service and Privacy Policy
                </FieldLabel>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
          {pending ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : null}
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
