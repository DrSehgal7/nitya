import { NextResponse } from "next/server";
import { auth, authConfigured, isOwnerEmail } from "@/auth";
import {
  deleteContactSubmission,
  getContactSubmissions,
  saveContactSubmission,
} from "@/lib/contact-store";
import { validateContactSubmission } from "@/lib/contact-validation";

export const dynamic = "force-dynamic";

async function ownerIsSignedIn(): Promise<boolean> {
  if (!authConfigured) return false;
  const session = await auth();
  return Boolean(session?.user.owner && isOwnerEmail(session.user.email));
}

export async function GET() {
  if (!(await ownerIsSignedIn())) {
    return NextResponse.json({ error: "Owner access required." }, { status: 401 });
  }
  try {
    return NextResponse.json(
      { submissions: await getContactSubmissions() },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Unable to read contact messages.", error);
    return NextResponse.json({ error: "Unable to load the private inbox." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const result = validateContactSubmission(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    await saveContactSubmission(result.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to save contact message.", error);
    return NextResponse.json(
      { error: "Your note could not be saved. Please try again or contact Hritik directly." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await ownerIsSignedIn())) {
    return NextResponse.json({ error: "Owner access required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    await deleteContactSubmission(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete this message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
