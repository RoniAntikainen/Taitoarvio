"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type MemberRole = "viewer" | "editor";
type FolderRole = "owner" | MemberRole;

function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

function requireEmail(session: any) {
  const email = session?.user?.email;
  if (!email) throw new Error("Not authenticated");
  return normalizeEmail(email);
}

async function getRole(folderId: string, email: string): Promise<FolderRole | null> {
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

export async function createFolder(
  name: string,
  sportId: "football" | "dance" = "football",
  athleteName: string = ""
) {
  const session = await auth();
  const ownerEmail = requireEmail(session);

  const folder = await prisma.folder.create({
    data: { name: String(name).trim(), ownerId: ownerEmail },
  });

  await prisma.folderMember.create({
    data: { folderId: folder.id, userEmail: ownerEmail, role: "editor" },
  });

  // Profiili tallennetaan heti luodessa (laji + oppilas)
  await prisma.folderItem.create({
    data: {
      folderId: folder.id,
      type: "profile",
      title: "Profiili",
      content: JSON.stringify({ sportId, athleteName }),
      createdBy: ownerEmail,
    },
  });

  revalidatePath("/app/folders");
  return folder.id;
}

export async function addMember(folderId: string, userEmail: string, role: MemberRole = "viewer") {
  const session = await auth();
  const me = requireEmail(session);

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: me },
    select: { id: true, name: true },
  });
  if (!folder) throw new Error("No access");

  const targetEmail = normalizeEmail(userEmail);
  if (!targetEmail) throw new Error("Email missing");

  await prisma.folderMember.upsert({
    where: { folderId_userEmail: { folderId, userEmail: targetEmail } },
    update: { role },
    create: { folderId, userEmail: targetEmail, role },
  });

  await prisma.notification.create({
    data: {
      userEmail: targetEmail,
      folderId,
      title: "Sinut lisättiin kansioon",
      body: `Kansio: ${folder.name}`,
      href: `/app/folders/${folderId}`,
    },
  });

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath("/app/folders");
}

export async function addMemberFromForm(folderId: string, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "viewer") as MemberRole;
  await addMember(folderId, email, role === "editor" ? "editor" : "viewer");
}

export async function listMyFolders() {
  const session = await auth();
  const me = requireEmail(session);

  return prisma.folder.findMany({
    where: { members: { some: { userEmail: me } } },
    select: {
      id: true,
      name: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
      members: { select: { userEmail: true, role: true, createdAt: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getFolderView(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getRole(folderId, me);
  if (!role) throw new Error("No access");

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
      members:
        role === "owner"
          ? { select: { userEmail: true, role: true, createdAt: true }, orderBy: { createdAt: "asc" } }
          : false,
    },
  });

  if (!folder) throw new Error("Folder not found");
  return { folder, role };
}

export async function leaveFolder(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getRole(folderId, me);
  if (!role) throw new Error("No access");
  if (role === "owner") throw new Error("Owner cannot leave folder");

  await prisma.folderMember.delete({
    where: { folderId_userEmail: { folderId, userEmail: me } },
  });

  revalidatePath("/app/folders");
  revalidatePath(`/app/folders/${folderId}`);
}

export async function removeMember(folderId: string, userEmail: string) {
  const session = await auth();
  const me = requireEmail(session);

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: me },
    select: { ownerId: true },
  });
  if (!folder) throw new Error("No access");

  const targetEmail = normalizeEmail(userEmail);
  if (!targetEmail) throw new Error("Email missing");
  if (targetEmail === normalizeEmail(folder.ownerId)) throw new Error("Cannot remove owner");

  await prisma.folderMember.delete({
    where: { folderId_userEmail: { folderId, userEmail: targetEmail } },
  });

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath("/app/folders");
}

export async function listFolderEvaluations(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const role = await getRole(folderId, me);
  if (!role) throw new Error("No access");

  return prisma.evaluation.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      subject: true,
      evaluator: true,
      sportLabel: true,
      createdAt: true,
      data: true,
    },
  });
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  const me = requireEmail(session);

  await prisma.notification.updateMany({
    where: { id, userEmail: me },
    data: { readAt: new Date() },
  });

  revalidatePath("/app/notifications");
}

export async function listNotifications() {
  const session = await auth();
  const me = requireEmail(session);

  return prisma.notification.findMany({
    where: { userEmail: me },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
