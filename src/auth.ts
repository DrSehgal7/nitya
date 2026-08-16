import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";

const configuredOwnerEmail = process.env.OWNER_EMAIL?.trim().toLocaleLowerCase("en-IN") ?? "";

export const authConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET &&
  process.env.AUTH_SECRET &&
  configuredOwnerEmail,
);

export function isOwnerEmail(email: string | null | undefined): boolean {
  return Boolean(
    configuredOwnerEmail && email?.trim().toLocaleLowerCase("en-IN") === configuredOwnerEmail,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "local-development-only-secret" : undefined),
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [Google],
  pages: { signIn: "/owner/sign-in" },
  callbacks: {
    signIn({ user }) {
      return Boolean(user.email);
    },
    jwt({ token, user }) {
      if (user?.email)
        (token as typeof token & { owner?: boolean }).owner = isOwnerEmail(user.email);
      return token;
    },
    session({ session, token }) {
      session.user.owner =
        (token as typeof token & { owner?: boolean }).owner === true &&
        isOwnerEmail(session.user.email);
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      owner?: boolean;
    };
  }
}
