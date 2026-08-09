# Frame In Goa

HH Goa 2026, Task #1 (Open Trials). Upload a photo, generate a branded HH Goa graphic (PFP frame or Builder ID card), download it, and share it to X with `#FrameInGoa`.

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the **Vercel KV** integration in your project settings (Settings → Integrations → Vercel KV).
4. Set the environment variable `NEXT_PUBLIC_BASE_URL` to your production domain (e.g. `https://frame-in-goa.vercel.app`).
5. Deploy.

No database or additional configuration is required — the KV store is optional and falls back to an in-memory store for local development.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Canvas 2D API for client-side rendering
- `@vercel/og` for server-rendered OG images
- Vercel KV for share-link persistence (optional)
