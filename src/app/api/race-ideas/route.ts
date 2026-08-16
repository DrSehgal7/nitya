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
        { error: "Sign in with Google to suggest a race or vote." },
        { status: 401 },
      );
    }

    if (body.action === "suggest") {
      return NextResponse.json(
        await suggestRaceIdea({
          visitorId: currentVisitor,
          name: body.name,
          location: body.location,
          type: body.type,
        }),
      );
    }
    if (body.action === "vote") {
      return NextResponse.json(await voteForRaceIdea(body.id, currentVisitor));
    }
    if (body.action === "delete") {
      return NextResponse.json({ ideas: await deleteRaceIdea(body.id, currentVisitor) });
    }
    throw new Error("Unknown race idea action.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update race ideas.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
