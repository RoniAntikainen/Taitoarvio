import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async session({ session }) {
      const email = session.user?.email;
      if (!email) return session;

      // ✅ varmin: hae käyttäjä + subscription emaililla
      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          role: true,
          onboardingCompletedAt: true,
          subscription: {
            select: {
              status: true,
              trialEndsAt: true,
              currentPeriodEnd: true,
              cancelAtPeriodEnd: true,
              stripeCustomerId: true,
              stripeSubscriptionId: true,
            },
          },
        },
      });

      // Jos käyttäjää ei löydy, jätä session ennalleen (harvinainen)
      if (!dbUser) {
        (session as any).role = "user";
        (session as any).onboardingCompletedAt = null;
        (session as any).subscription = { status: "FREE" };
        return session;
      }

      (session as any).userId = dbUser.id; // hyödyllinen webhook/checkout metadataan
      (session as any).role = dbUser.role ?? "user";
      (session as any).onboardingCompletedAt = dbUser.onboardingCompletedAt ?? null;

      (session as any).subscription = dbUser.subscription
        ? {
            status: dbUser.subscription.status,
            trialEndsAt: dbUser.subscription.trialEndsAt,
            currentPeriodEnd: dbUser.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: dbUser.subscription.cancelAtPeriodEnd,
            stripeCustomerId: dbUser.subscription.stripeCustomerId,
            stripeSubscriptionId: dbUser.subscription.stripeSubscriptionId,
          }
        : { status: "FREE" };

      return session;
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
