import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { verifySchema, type VerifyValues } from '@/lib/auth/schemas'
import { getPendingVerification, verifyEmailCode } from '@/lib/auth/session'

const searchSchema = z.object({
  email: z.string().optional(),
})

export const Route = createFileRoute('/verify')({
  validateSearch: searchSchema,
  component: VerifyPage,
})

function VerifyPage() {
  const navigate = useNavigate()
  const { email: emailFromSearch } = Route.useSearch()
  const pending = getPendingVerification()
  const email = emailFromSearch ?? pending?.email ?? 'your email'
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  })

  async function onSubmit(values: VerifyValues) {
    setPendingSubmit(true)
    try {
      await verifyEmailCode(values.code)
      toast.success('Email verified')
      await navigate({ to: '/workspace' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setPendingSubmit(false)
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      description={`Enter the 6-digit code we sent to ${email}. For this demo, any 6-digit code works.`}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Go back
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel htmlFor="verify-code">Verification code</FieldLabel>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  id="verify-code"
                  aria-invalid={!!fieldState.error || undefined}
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-10 rounded-lg border text-base"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription>Codes expire after 10 minutes.</FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={pendingSubmit}>
          {pendingSubmit ? (
            <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
          ) : null}
          Verify and continue
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => toast.message('A new code is on the way')}
        >
          Resend code
        </Button>
      </form>
    </AuthLayout>
  )
}
