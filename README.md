This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Super admin

The sitewide dashboard is at `/super-admin`. Sign in with a Firebase Authentication account whose **verified** email is listed in `SUPER_ADMIN_EMAILS`. The initial address is configured in `apphosting.yaml`. For local development, set the same variable in `.env` (it is already set in this workspace). To add another super admin, add their verified sign-in email to the comma-separated list and redeploy.

The dashboard shows public page views over the last 14 days, listing views, per-listing clicks on both WhatsApp contact options, all accounts, and all listings. The Contact Agent count includes earlier clicks; Quick WhatsApp clicks start counting with this version. These are button clicks, not confirmed messages or unique people. The dashboard can disable or enable accounts, boost or unboost listings, and suspend or restore listings. Suspended listings remain in the admin dashboards but are hidden from the public homepage and direct listing pages until restored. Boosted available listings appear first in the homepage Featured listings section. Traffic begins accumulating with this version and counts page views, including repeat visits; it is not a count of unique people.

Firebase App Hosting supplies Application Default Credentials to the server. For local use of the super admin APIs, authenticate the local machine for the same Firebase project with `gcloud auth application-default login`. A signed-in Firebase browser account alone is insufficient for the server SDK. Never put a service account private key or an ID token in `.env` or the repository.

Deploy the included Firestore rules with `firebase deploy --only firestore:rules` for account disabling, listing promotion, and suspension to be enforced against direct browser writes. Review them against any rules currently deployed for this project before replacing those rules. The server's Firebase Admin SDK bypasses Firestore rules, so its API routes verify the Firebase ID token, the account status, the verified email, and the configured allowlist before every super admin action.

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
