import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, authConfigured, isOwnerEmail, signOut } from "@/auth";
import { OwnerStudio } from "@/components/OwnerStudio";
import { getContactSubmissions } from "@/lib/contact-store";
import { getSiteContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Owner content studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  if (!authConfigured) redirect("/owner/sign-in?error=Configuration");
  const session = await auth();
  if (!session?.user.owner || !isOwnerEmail(session.user.email)) redirect("/owner/sign-in");
  const [content, submissions] = await Promise.all([
    getSiteContent(),
    getContactSubmissions().catch((error) => {
      console.error("Unable to load the owner message inbox.", error);
      return [];
    }),
  ]);

  return (
    <main id="main-content" className="ownerPage">
      <section className="shell ownerStudioHeader">
        <div>
          <p className="eyebrow">Private owner studio</p>
          <h1>Keep Nitya current.</h1>
          <p>
            Signed in as {session.user.email}. Every save is validated and written on the server.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="button buttonGhost" type="submit">
            Sign out
          </button>
        </form>
      </section>
      <OwnerStudio initialContent={content} initialSubmissions={submissions} />
    </main>
  );
}
