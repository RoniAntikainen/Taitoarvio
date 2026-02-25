"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FolderRole = "owner" | "editor" | "viewer" | "student";
type SectionType = "profile" | "plan" | "upcoming" | "results";

function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

function requireEmail(session: any) {
  const email = session?.user?.email;
  if (!email) throw new Error("Not authenticated");
  return normalizeEmail(email);
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

  if (member.role === "editor") return "editor";
  if (member.role === "student") return "student";
  return "viewer";
}

function assertMinRole(role: FolderRole, min: "viewer" | "editor" | "owner") {
  const rank: Record<FolderRole, number> = { viewer: 1, student: 1, editor: 2, owner: 3 };
  const minRank: Record<"viewer" | "editor" | "owner", number> = { viewer: 1, editor: 2, owner: 3 };
  if (rank[role] < minRank[min]) throw new Error("No access");
}

async function upsertSingleSection(
  folderId: string,
  type: SectionType,
  title: string,
  content: string,
  createdBy?: string
) {
  const existing = await prisma.folderItem.findFirst({
    where: { folderId, type },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  if (!existing) {
    await prisma.folderItem.create({
      data: {
        folderId,
        type,
        title,
        content,
        createdBy: createdBy ?? null,
      },
    });
    return;
  }

  await prisma.folderItem.update({
    where: { id: existing.id },
    data: { title, content },
  });
}

export async function getFolderProfile(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");

  const profile = await prisma.folderItem.findFirst({
    where: { folderId, type: "profile" },
    orderBy: { updatedAt: "desc" },
    select: { content: true },
  });

  let parsed: { sportId?: string; athleteName?: string } = {};
  try {
    if (profile?.content) parsed = JSON.parse(profile.content);
  } catch {}

  return {
    role,
    sportId: (parsed.sportId as any) ?? "football",
    athleteName: parsed.athleteName ?? "",
  };
}

export async function saveFolderProfileFromForm(folderId: string, formData: FormData) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");
  assertMinRole(role, "editor");

  const sportId = String(formData.get("sportId") ?? "football").trim();
  const athleteName = String(formData.get("athleteName") ?? "").trim();

  const content = JSON.stringify({ sportId, athleteName });
  await upsertSingleSection(folderId, "profile", "Profiili", content, me);

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath(`/app/folders/${folderId}/settings`);
}

export async function getSection(folderId: string, type: SectionType) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");

  const doc = await prisma.folderItem.findFirst({
    where: { folderId, type },
    orderBy: { updatedAt: "desc" },
    select: { title: true, content: true, updatedAt: true },
  });

  return {
    role,
    title: doc?.title ?? "",
    content: doc?.content ?? "",
    updatedAt: doc?.updatedAt ?? null,
  };
}

export async function saveSectionFromForm(
  folderId: string,
  type: Exclude<SectionType, "results" | "profile" | "upcoming">,
  formData: FormData
) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");
  assertMinRole(role, "editor");

  const title = String(formData.get("title") ?? "").trim() || defaultTitle(type);
  const content = String(formData.get("content") ?? "");

  await upsertSingleSection(folderId, type, title, content, me);
  revalidatePath(`/app/folders/${folderId}`);
}

export async function saveResultsJsonFromForm(folderId: string, formData: FormData) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");
  assertMinRole(role, "editor");

  const resultsJson = String(formData.get("resultsJson") ?? "[]");
  await upsertSingleSection(folderId, "results", "Tulokset", resultsJson, me);

  revalidatePath(`/app/folders/${folderId}`);
}

export async function saveUpcomingJsonFromForm(folderId: string, formData: FormData) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");
  assertMinRole(role, "editor");

  const upcomingJson = String(formData.get("upcomingJson") ?? "");

  // Title is fixed
  await upsertSingleSection(folderId, "upcoming", "Tulevat kilpailut / pelit", upcomingJson, me);

  revalidatePath(`/app/folders/${folderId}`);
}

function defaultTitle(type: Exclude<SectionType, "results" | "profile" | "upcoming">) {
  if (type === "plan") return "Valmennussuunnitelma";
  return "—";
}
