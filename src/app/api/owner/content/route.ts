import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth, isOwnerEmail } from "@/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

async function ownerIsAuthenticated(): Promise<boolean> {
  const session = await auth();
  return session?.user.owner === true && isOwnerEmail(session.user.email);
}

export async function GET() {
  if (!(await ownerIsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent(), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function PUT(request: Request) {
  if (!(await ownerIsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await saveSiteContent(await request.json());
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/goals");
    revalidatePath("/habits");
    revalidatePath("/events");
    revalidatePath("/races");
    revalidatePath("/owner");
    return NextResponse.json(content, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
