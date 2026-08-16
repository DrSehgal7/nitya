import { NextResponse } from "next/server";
import { authConfigured } from "@/auth";
import { getHabitJoinSummaries, toggleHabitJoin } from "@/lib/habit-join-store";
import { signedInAccountId } from "@/lib/account-identity";

export const dynamic = "force-dynamic";

export async function GET() {
  const accountId = await signedInAccountId("habit-member");
  return NextResponse.json(
    {
      joins: await getHabitJoinSummaries(accountId),
      authenticated: Boolean(accountId),
      authAvailable: authConfigured,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  try {
    const accountId = await signedInAccountId("habit-member");
    if (!accountId) {
      return NextResponse.json({ error: "Sign in with Google to join a habit." }, { status: 401 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    return NextResponse.json(await toggleHabitJoin(body.habitId, accountId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this habit.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
