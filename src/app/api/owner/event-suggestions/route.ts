import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth, isOwnerEmail } from "@/auth";
import {
  deleteRaceIdeaAsOwner,
  getOwnerRaceIdeas,
  updateRaceIdeaAsOwner,
} from "@/lib/race-idea-store";

export const dynamic = "force-dynamic";

async function ownerIsAuthenticated(): Promise<boolean> {
  const session = await auth();
  return session?.user.owner === true && isOwnerEmail(session.user.email);
}

function refreshEventPages() {
  revalidatePath("/events");
  revalidatePath("/races");
  revalidatePath("/owner");
}

export async function GET() {
  if (!(await ownerIsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { ideas: await getOwnerRaceIdeas() },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function PUT(request: Request) {
  if (!(await ownerIsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ideas = await updateRaceIdeaAsOwner(body.id, {
      name: body.name,
      location: body.location,
      type: body.type,
    });
    refreshEventPages();
    return NextResponse.json({ ideas });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update that event idea.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await ownerIsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ideas = await deleteRaceIdeaAsOwner(body.id);
    refreshEventPages();
    return NextResponse.json({ ideas });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete that event idea.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
