# Instaparse Next.js Application

This project is a full-stack Next.js application that provides event scheduling and parsing functionality. It uses App Router, Tailwind CSS v4, and integrates with Supabase for data persistence and authentication.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Environment configuration

Make sure to provide a `.env.local` containing your Supabase variables:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Note:** Ensure to exclude the Next.js cache directory `.next` from your source control to avoid bloated commits. It is ignored in our `.gitignore`.
