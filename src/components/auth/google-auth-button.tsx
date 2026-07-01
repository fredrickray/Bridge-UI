import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { loginWithGoogle } from '@/lib/auth/session'

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M5.3 14.3 4.4 15l-2.2 1.7C3.7 20 7.6 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-5.9-4.4z"
      />
      <path
        fill="#4A90E2"
        d="M3 7.3C2.4 8.5 2 9.7 2 11s.4 2.5 1 3.7l2.3-1.8v-.1C4.9 11.5 4.7 10.3 4.7 9c0-1.3.2-2.5.6-3.7z"
      />
      <path
        fill="#FBBC05"
        d="M12 4.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 1.5 14.7.5 12 .5 7.6.5 3.7 3 2.2 7.3l2.5 1.9C5.5 6.6 8 4.5 12 4.5z"
      />
    </svg>
  )
}

export function GoogleAuthButton({ label = 'Continue with Google' }: { label?: string }) {
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setPending(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      toast.message(error instanceof Error ? error.message : 'Google sign-in unavailable')
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-10 w-full"
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? (
        <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
      ) : (
        <span data-icon="inline-start">
          <GoogleMark />
        </span>
      )}
      {label}
    </Button>
  )
}
