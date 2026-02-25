// lib/access.ts
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export type EntitlementStatus = "FREE" | "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";
export type FolderRole = "owner" | "editor" | "viewer" | "student";

export function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

export function requireEmail(session: Session | null | undefined) {
  const email = (session as any)?.user?.email;
  if (!email) throw new Error("Not authenticated");
  return normalizeEmail(email);
}

export function getEntitlement(session: Session | null | undefined) {
  const s = (session as any)?.subscription;
  const status: EntitlementStatus = (s?.status as EntitlementStatus) ?? "FREE";
  const hasPro = status === "TRIAL" || status === "ACTIVE";

  return {
    status,
    hasPro,
    trialEndsAt: s?.trialEndsAt ? new Date(s.trialEndsAt) : null,
    currentPeriodEnd: s?.currentPeriodEnd ? new Date(s.currentPeriodEnd) : null,
  };
}

export function requirePro(session: Session | null | undefined) {
  const ent = getEntitlement(session);
  if (!ent.hasPro) throw new Error("Subscription required");
  return ent;
}

export async function getFolderRole(folderId: string, email: string): Promise<FolderRole | null> {
  const me = normalizeEmail(email);

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { ownerId: true },
  });
  if (!folder) return null;

  if (normalizeEmail(folder.ownerId) === me) return "owner";

  // ✅ Schema: FolderMember @@id([folderId, userEmail]) → findUnique folderId_userEmail
  const member = await prisma.folderMember.findUnique({
    where: { folderId_userEmail: { folderId, userEmail: me } },
    select: { role: true },
  });

  if (!member) return null;
  if (member.role === "editor") return "editor";
  if (member.role === "student") return "student";
  return "viewer";
}

function roleRank(role: FolderRole) {
  if (role === "owner") return 3;
  if (role === "editor") return 2;
  if (role === "student") return 1;
  return 1;
}

export async function requireFolderAccess(folderId: string, email: string, minRole: FolderRole = "viewer") {
  const role = await getFolderRole(folderId, email);
  if (!role) throw new Error("No access");

  if (roleRank(role) < roleRank(minRole)) throw new Error("Insufficient permissions");

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
  });

  if (!folder) throw new Error("Folder not found");
  return { folder, role };
}

export async function listAccessibleFolderIds(email: string) {
  const me = normalizeEmail(email);
  const rows = await prisma.folderMember.findMany({
    where: { userEmail: me },
    select: { folderId: true },
  });
  return rows.map((r) => r.folderId);
}
