This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env` file with:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=alerts@surajc.in
COMPLIANCE_TEAM_EMAIL=compliance@your-domain.com
# Optional fallback when originatingBankEmail is missing
DEFAULT_ORIGINATING_BANK_EMAIL=bank-ops@your-domain.com
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Clerk integration and webhooks

This app uses Clerk for authentication and persists users in the local Prisma database.

- The app lazily syncs a signed-in user on first visit to `/dashboard` (see `src/app/dashboard/layout.tsx`).
- A webhook handler is provided at `/api/webhooks/clerk` to create/upsert users when Clerk emits `user.created` events. Ensure you configure this webhook in your Clerk dashboard.

Environment variables to set for full behavior:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...            # used to fetch user details from Clerk API if not present in webhook
CLERK_WEBHOOK_SECRET=whsec_...     # used to verify Clerk webhook signatures
``` 

Webhook notes:
- Point your Clerk webhook to `https://<your-host>/api/webhooks/clerk` and enable `user.created` events.
- If you set `CLERK_SECRET_KEY` the webhook handler will fetch missing user details from Clerk.

Role management:
- New users are upserted with a default role of `BANK_USER`. Roles are stored in the `User` Prisma model and can be read via the helper `src/lib/getUserRole.ts`.

