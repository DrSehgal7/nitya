import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, authConfigured, isOwnerEmail, signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Owner sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user.owner && isOwnerEmail(session.user.email)) redirect("/owner");
  const { error } = await searchParams;

  return (
    <main id="main-content" className="ownerLoginPage">
      <section className="ownerLoginCard">
        <span className="ownerLoginMark" aria-hidden="true">
          न
        </span>
        <p className="eyebrow">Private owner studio</p>
        <h1>Sign in to update Nitya.</h1>
        <p>
          Google sign-in is restricted to Hritik&apos;s approved account. Public visitors cannot
          view or save these controls.
        </p>
        {!authConfigured || error === "Configuration" ? (
          <p className="ownerLoginError">
            Authentication is not available in this deployment. Confirm the four AUTH/OWNER
            environment variables and redeploy.
          </p>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/owner" });
            }}
          >
            <button className="button buttonPrimary buttonWide" type="submit">
              Continue with Google
            </button>
          </form>
        )}
        {error && error !== "Configuration" && (
          <p className="ownerLoginError">That Google account is not authorized to edit Nitya.</p>
        )}
        <a href="/">Return to the public page</a>
      </section>
    </main>
  );
}
