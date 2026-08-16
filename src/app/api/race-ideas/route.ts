import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { auth, authConfigured } from "@/auth";
import {
  deleteRaceIdea,
  getPublicRaceIdeas,
  suggestRaceIdea,
  voteForRaceIdea,
} from "@/lib/race-idea-store";

export const dynamic = "force-dynamic";

async function visitorId(): Promise<string> {
  if (!authConfigured || !process.env.AUTH_SECRET) return "";
  const session = await auth();
  const email = session?.user.email?.trim().toLocaleLowerCase("en-IN");
  if (!email) return "";
  return createHmac("sha256", process.env.AUTH_SECRET)
    .update(`nitya-race-voter:${email}`)
    .digest("hex");
}

export async function GET() {
  const currentVisitor = await visitorId();
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
    const currentVisitor = await visitorId();
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
