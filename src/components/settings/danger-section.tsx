import { useNavigate } from '@tanstack/react-router'
import {
  LoaderCircleIcon,
  LogOutIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SettingsPanel } from '@/components/settings/settings-shell'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteAccount, logout } from '@/lib/auth/session'

export function DangerSection() {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteAccount()
      toast.success('Account deleted')
      await navigate({ to: '/signup' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete account')
      setDeleting(false)
    }
  }

  function handleSignOut() {
    logout()
    void navigate({ to: '/login' })
  }

  return (
    <SettingsPanel
      tone="danger"
      icon={<TriangleAlertIcon />}
      title="Danger zone"
      description="Sign out of this device, or permanently remove your Bridge account."
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-xl bg-background/80 p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <LogOutIcon className="size-3.5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-sm text-muted-foreground">
                End this session on the current device.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="active:scale-[0.97]"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-destructive/5 p-4 ring-1 ring-destructive/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <TriangleAlertIcon className="size-3.5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Removes your profile from this demo. Production would settle open
                agreements first.
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="active:scale-[0.97]"
                  disabled={deleting}
                />
              }
            >
              Delete account
            </AlertDialogTrigger>
            <AlertDialogContent size="default">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TriangleAlertIcon className="text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. You will need to create a new account to
                  use Bridge again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? (
                    <LoaderCircleIcon
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                  ) : null}
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </SettingsPanel>
  )
}
