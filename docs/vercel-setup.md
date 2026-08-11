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

## Private owner studio

Connect the private `nitya-content` Blob store to Production and Preview, then add these server-only variables:

```text
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>
AUTH_SECRET=<random server secret>
OWNER_EMAIL=sarojhritik@gmail.com
```

The Google OAuth web client must allow `https://nitya-project.vercel.app` and redirect to `https://nitya-project.vercel.app/api/auth/callback/google`. A new Blob connection uses short-lived Vercel OIDC authentication; do not copy a long-lived Blob token into source code.

## Repository settings

- Keep the Vercel GitHub integration enabled so pushes to `main` deploy automatically.
- GitHub Actions remains responsible for verification only.
- Disable GitHub Pages under **Repository Settings → Pages** after the Vercel production URL has been reviewed.
- Keep the repository private until the owner approves all public copy and numbers, if desired.

Never paste secrets into source files, issues, screenshots, or variables prefixed with `NEXT_PUBLIC_`.
