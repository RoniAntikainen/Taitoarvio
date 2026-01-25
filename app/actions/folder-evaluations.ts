"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FolderRole = "owner" | "editor" | "viewer";

function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

function requireEmail(session: any) {
  const email = session?.user?.email;
  if (!email) throw new Error("Not authenticated");
  return normalizeEmail(email);
}

async function requireUserIdByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user?.id) throw new Error("User not found in database");
  return user.id;
}

async function getFolderRole(folderId: string, email: string): Promise<FolderRole | null> {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { ownerId: true },
  });
  if (!folder) return null;

  if (normalizeEmail(folder.ownerId) === email) return "owner";

  const member = await prisma.folderMember.findUnique({
    where: { folderId_userEmail: { folderId, userEmail: email } },
    select: { role: true },
  });
  if (!member) return null;

  return member.role === "editor" ? "editor" : "viewer";
}

function assertMinRole(role: FolderRole, min: "viewer" | "editor" | "owner") {
  const rank: Record<FolderRole, number> = { viewer: 1, editor: 2, owner: 3 };
  const minRank: Record<"viewer" | "editor" | "owner", number> = { viewer: 1, editor: 2, owner: 3 };
  if (rank[role] < minRank[min]) throw new Error("No access");
}

function areasForSport(sportId: string) {
  if (sportId === "dance") return ["Tekniikka", "Rytmi", "Esiintyminen", "Pari-/ryhmätyö", "Kestävyys"];
  return ["Joukkuepelaaminen", "Tekniikka", "Peliasenne", "Taktinen ymmärrys", "Fyysisyys"];
}

export async function createFolderEvaluationFromForm(folderId: string, formData: FormData) {
  const session = await auth();
  const meEmail = requireEmail(session);

  const role = await getFolderRole(folderId, meEmail);
  if (!role) throw new Error("No access");
  assertMinRole(role, "editor");

  const userId = await requireUserIdByEmail(meEmail);

  const evaluator = String(formData.get("evaluator") ?? "").trim() || meEmail;
  const subject = String(formData.get("subject") ?? "").trim() || "Oppilas";

  const sportId = String(formData.get("sportId") ?? "football").trim();
  const sportLabel = sportId === "dance" ? "Tanssi" : "Jalkapallo";

  const areas = areasForSport(sportId);

  const scores: Record<string, number> = {};
  for (const a of areas) {
    const raw = String(formData.get(`score:${a}`) ?? "").trim();

    if (!raw || raw === "unrated") continue; // ✅ arvioimaton

    const n = Number(raw);
    if (!Number.isFinite(n) || n < 1 || n > 5) continue;
    scores[a] = n;
  }

  const notes = String(formData.get("notes") ?? "").trim();

  const data = {
    scale: "official_1_5",
    areas,
    scores,
    notes,
  };

  await prisma.evaluation.create({
    data: {
      userId,
      evaluator,
      subject,
      sportId,
      sportLabel,
      scaleId: "official",
      scaleLabel: "Virallinen 1–5",
      data: data as any,
      folderId,
    },
  });

  revalidatePath(`/app/folders/${folderId}`);
}
