// lib/limits.ts
import { prisma } from "@/lib/prisma";

export async function assertFolderLimit(email: string, status: string) {
  if (status !== "FREE") return;

  const folders = await prisma.folder.count({
    where: { members: { some: { userEmail: email } } },
  });

  if (folders >= 1) {
    throw new Error("FREE tier: max 1 kansio. Päivitä PRO:hon jatkaaksesi.");
  }
}

export async function assertEvaluationLimit(folderId: string, status: string) {
  if (status !== "FREE") return;

  const count = await prisma.evaluation.count({ where: { folderId } });

  if (count >= 10) {
    throw new Error("FREE tier: max 10 arviointia per kansio. Päivitä PRO:hon jatkaaksesi.");
  }
}
