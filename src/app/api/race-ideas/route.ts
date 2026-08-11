import { NextResponse } from "next/server";
import {
  deleteRaceIdea,
  getPublicRaceIdeas,
  suggestRaceIdea,
  voteForRaceIdea,
} from "@/lib/race-idea-store";

export const dynamic = "force-dynamic";

function visitorId(request: Request): string {
  return request.headers.get("x-nitya-visitor-id")?.trim().slice(0, 100) ?? "";
}

export async function GET(request: Request) {
  return NextResponse.json(await getPublicRaceIdeas(visitorId(request)), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const currentVisitor = visitorId(request);
    if (!currentVisitor) throw new Error("This browser could not be identified.");

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
      return NextResponse.json({ ideas: await voteForRaceIdea(body.id, currentVisitor) });
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
