# Vercel setup

The repository is ready to run as a normal Next.js application on Vercel. Deployment does not require a `vercel.json` file.

## Connect the project

1. Sign in to Vercel with the GitHub account that can access `DrSehgal7/nitya`.
2. Choose **Add New → Project** and import the `nitya` repository.
3. Keep the detected framework as **Next.js**.
4. Keep the root directory as the repository root and the default install/build commands.
5. Deploy the project.

Vercel will provide a `*.vercel.app` address. Copy that final production address.

## Configure the canonical URL

In **Project → Settings → Environment Variables**, add:

```text
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Apply it to Production and Preview, then redeploy. Replace it later if a custom domain is connected.

## Repository settings

- Keep the Vercel GitHub integration enabled so pushes to `main` deploy automatically.
- GitHub Actions remains responsible for verification only.
- Disable GitHub Pages under **Repository Settings → Pages** after the Vercel production URL has been reviewed.
- Keep the repository private until the owner approves all public copy and numbers, if desired.

## Owner dashboard follow-up

Do not add authentication secrets yet. Once the Vercel deployment is confirmed, implement the owner identity, server-side authorization, persistence choice, and the complete editable-field schema together. The running kilometres and as-of date are the first required fields.

Never paste secrets into source files, issues, screenshots, or variables prefixed with `NEXT_PUBLIC_`.
