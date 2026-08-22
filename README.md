# Bridge

Escrow-as-a-service frontend built with React, TanStack Router, Tailwind CSS v4, and shadcn/ui.

## Stack

- React 19 + Vite 8
- TanStack Router (file-based)
- Tailwind CSS v4 + shadcn (base-nova)
- React Hook Form + Zod
- Motion (auth panel micro-interactions)

## Routes

| Path | Screen |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Sign in (email + Google CTA) |
| `/signup` | Create account |
| `/verify` | Email verification OTP |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set a new password |
| `/overview` | Signed-in dashboard |
| `/agreements` | Agreement list |
| `/agreements/$agreementId` | Agreement detail |
| `/create-agreement` | New agreement wizard |
| `/settings` | Workspace settings |

Auth is currently mocked in `src/lib/auth/session.ts` (localStorage). Wire these helpers to the NestJS API when ready.

## Develop

```bash
pnpm install
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — start Vite
- `pnpm build` — production build
- `pnpm generate-routes` — regenerate the TanStack route tree
- `pnpm lint` / `pnpm format` — ESLint + Prettier
