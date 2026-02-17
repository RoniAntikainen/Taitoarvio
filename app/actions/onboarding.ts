// app/actions/onboarding.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireEmail, normalizeEmail } from "@/lib/access";
import { revalidatePath } from "next/cache";

export async function getOnboardingState() {
  const session = await auth();
  const email = requireEmail(session);

  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
    select: { onboardingCompletedAt: true, role: true, name: true, email: true },
  });

  if (!user) throw new Error("User not found");

  return {
    completed: !!user.onboardingCompletedAt,
    role: user.role,
    name: user.name,
    email: user.email,
  };
}

export async function completeOnboarding() {
  const session = await auth();
  const email = requireEmail(session);

  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { onboardingCompletedAt: new Date() },
  });

  revalidatePath("/app");
  revalidatePath("/app/onboarding");
  return { ok: true };
}
