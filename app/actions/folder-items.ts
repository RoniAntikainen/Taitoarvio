"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireEmail, requireFolderAccess } from "@/lib/access";

export async function listFolderItems(folderId: string, type?: string) {
  const session = await auth();
  const me = requireEmail(session);

  await requireFolderAccess(folderId, me, "viewer");

  return prisma.folderItem.findMany({
    where: { folderId, ...(type ? { type } : {}) },
    orderBy: { createdAt: "asc" },
    select: { id: true, folderId: true, type: true, title: true, content: true, createdBy: true, createdAt: true, updatedAt: true },
  });
}

export async function listFolderComments(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  await requireFolderAccess(folderId, me, "viewer");

  return prisma.folderItem.findMany({
    where: { folderId, type: "comment" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 100,
  });
}

export async function createFolderCommentFromForm(folderId: string, formData: FormData) {
  const session = await auth();
  const me = requireEmail(session);

  await requireFolderAccess(folderId, me, "viewer");

  const text = String(formData.get("comment") ?? "").trim();
  if (!text) return;

  await prisma.folderItem.create({
    data: {
      folderId,
      type: "comment",
      title: "Kommentti",
      content: text,
      createdBy: me,
      updatedAt: new Date(),
    },
  });

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { name: true, ownerId: true, members: { select: { userEmail: true } } },
  });

  if (folder) {
    const targets = new Set(
      [folder.ownerId, ...folder.members.map((m) => m.userEmail)]
        .map((v) => String(v || "").trim().toLowerCase())
        .filter((v) => !!v && v !== me)
    );

    const short = text.length > 90 ? `${text.slice(0, 90)}…` : text;

    if (targets.size > 0) {
      await prisma.notification.createMany({
        data: Array.from(targets).map((email) => ({
          userEmail: email,
          folderId,
          title: `Uusi kommentti kansiossa ${folder.name}`,
          body: `${me}: ${short}`,
          href: `/app/folders/${folderId}#discussion`,
        })),
      });
    }
  }

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath("/app/notifications");
}

export async function createFolderItem(folderId: string, type: string, title: string, content: string) {
  const session = await auth();
  const me = requireEmail(session);

  await requireFolderAccess(folderId, me, "editor");

  const item = await prisma.folderItem.create({
    data: {
      folderId,
      type,
      title: String(title).trim(),
      content: String(content ?? ""),
      createdBy: me,
    },
  });

  revalidatePath(`/app/folders/${folderId}`);
  return item.id;
}

export async function updateFolderItem(itemId: string, content: string) {
  const session = await auth();
  const me = requireEmail(session);

  const item = await prisma.folderItem.findUnique({
    where: { id: itemId },
    select: { folderId: true },
  });
  if (!item) throw new Error("Item not found");

  await requireFolderAccess(item.folderId, me, "editor");

  await prisma.folderItem.update({
    where: { id: itemId },
    data: { content: String(content ?? ""), updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${item.folderId}`);
}

export async function deleteFolderItem(itemId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const item = await prisma.folderItem.findUnique({
    where: { id: itemId },
    select: { folderId: true },
  });
  if (!item) throw new Error("Item not found");

  await requireFolderAccess(item.folderId, me, "editor");

  await prisma.folderItem.delete({ where: { id: itemId } });

  revalidatePath(`/app/folders/${item.folderId}`);
}
