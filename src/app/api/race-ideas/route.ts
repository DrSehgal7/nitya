import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authConfigured } from "@/auth";
import { signedInAccountId } from "@/lib/account-identity";
import {
  deleteRaceIdea,
  getPublicRaceIdeas,
  suggestRaceIdea,
  voteForRaceIdea,
} from "@/lib/race-idea-store";

export const dynamic = "force-dynamic";

function refreshEventPages() {
  revalidatePath("/events");
  revalidatePath("/races");
  revalidatePath("/owner");
}

export async function GET() {
  const currentVisitor = await signedInAccountId("race-voter");
  return NextResponse.json(
    {
      ideas: await getPublicRaceIdeas(currentVisitor),
      authenticated: Boolean(currentVisitor),
      authAvailable: authConfigured,
    },
    {
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const currentVisitor = await signedInAccountId("race-voter");
    if (!currentVisitor) {
      return NextResponse.json(
        { error: "Sign in with Google to suggest an event or vote." },
        { status: 401 },
      );
    }

    if (body.action === "suggest") {
      const result = await suggestRaceIdea({
        visitorId: currentVisitor,
        name: body.name,
        location: body.location,
        type: body.type,
      });
      refreshEventPages();
      return NextResponse.json(result);
    }
    if (body.action === "vote") {
      const result = await voteForRaceIdea(body.id, currentVisitor);
      refreshEventPages();
      return NextResponse.json(result);
    }
    if (body.action === "delete") {
      const ideas = await deleteRaceIdea(body.id, currentVisitor);
      refreshEventPages();
      return NextResponse.json({ ideas });
    }
    throw new Error("Unknown event idea action.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update event ideas.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
