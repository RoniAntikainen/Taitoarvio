"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FolderRole = "owner" | "editor" | "viewer";

function requireEmail(session: any) {
  const email = session?.user?.email;
  if (!email) throw new Error("Not authenticated");
  return String(email).trim().toLowerCase();
}

async function getFolderRole(folderId: string, email: string): Promise<FolderRole | null> {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { ownerId: true },
  });
  if (!folder) return null;

  if (String(folder.ownerId).toLowerCase() === email) return "owner";

  const member = await prisma.folderMember.findUnique({
    where: { folderId_userEmail: { folderId, userEmail: email } },
    select: { role: true },
  });

  if (!member) return null;
  return member.role === "editor" ? "editor" : "viewer";
}

function assertRole(role: FolderRole, min: FolderRole) {
  const rank: Record<FolderRole, number> = { viewer: 1, editor: 2, owner: 3 };
  if (rank[role] < rank[min]) throw new Error("No access");
}

export async function listFolderItems(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");

  return prisma.folderItem.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      title: true,
      content: true,
      url: true,
      createdBy: true,
      createdAt: true,
    },
  });
}

export async function createFolderItem(folderId: string, payload: { type: string; title: string; content?: string; url?: string }) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getFolderRole(folderId, me);
  if (!role) throw new Error("No access");
  assertRole(role, "editor");

  const type = String(payload.type ?? "").trim() || "note";
  const title = String(payload.title ?? "").trim();
  const content = payload.content != null ? String(payload.content) : null;
  const url = payload.url != null ? String(payload.url).trim() : null;

  if (!title) throw new Error("Title missing");

  await prisma.folderItem.create({
    data: {
      folderId,
      type,
      title,
      content,
      url,
      createdBy: me,
    },
  });

  // Halutessasi: notifioi muut jäsenet (nyt pidetään yksinkertaisena)
  revalidatePath(`/app/folders/${folderId}`);
}

export async function createFolderItemFromForm(folderId: string, formData: FormData) {
  const type = String(formData.get("type") ?? "note").trim();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const url = String(formData.get("url") ?? "").trim();

  await createFolderItem(folderId, {
    type,
    title,
    content: content ? content : undefined,
    url: url ? url : undefined,
  });
}

export async function deleteFolderItem(itemId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const item = await prisma.folderItem.findUnique({
    where: { id: itemId },
    select: { id: true, folderId: true },
  });
  if (!item) return;

  const role = await getFolderRole(item.folderId, me);
  if (!role) throw new Error("No access");
  assertRole(role, "editor");

  await prisma.folderItem.delete({ where: { id: itemId } });

  revalidatePath(`/app/folders/${item.folderId}`);
}
