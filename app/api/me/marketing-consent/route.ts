import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const consent = !!body?.marketingConsent;

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      marketingConsent: consent,
      marketingConsentAt: consent ? new Date() : null,
      unsubscribedAt: consent ? null : new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    marketingConsent: user.marketingConsent,
    marketingConsentAt: user.marketingConsentAt,
    unsubscribedAt: user.unsubscribedAt,
  });
}
