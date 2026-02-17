// app/(product)/app/(gated)/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEntitlement } from "@/lib/access";

export default async function GatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/app");

  const ent = getEntitlement(session);
  if (!ent.hasPro) redirect("/app/settings");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { onboardingCompletedAt: true },
  });

  if (!user?.onboardingCompletedAt) redirect("/app/onboarding");

  return <>{children}</>;
}
