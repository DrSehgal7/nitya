import "server-only";

import { createHmac } from "node:crypto";
import { auth, authConfigured } from "@/auth";

export async function signedInAccountId(scope: string): Promise<string> {
  if (!authConfigured || !process.env.AUTH_SECRET) return "";
  const session = await auth();
  const email = session?.user.email?.trim().toLocaleLowerCase("en-IN");
  if (!email) return "";
  return createHmac("sha256", process.env.AUTH_SECRET)
    .update(`nitya-${scope}:${email}`)
    .digest("hex");
}
