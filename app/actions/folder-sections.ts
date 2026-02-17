// app/actions/folder-sections.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireEmail, requireFolderAccess } from "@/lib/access";

type SectionContent = { itemIds: string[] };

function parseContent(s: string | null | undefined): SectionContent {
  try {
    const j = JSON.parse(s || "{}");
    return { itemIds: Array.isArray(j.itemIds) ? j.itemIds.map(String) : [] };
  } catch {
    return { itemIds: [] };
  }
}

function stringifyContent(v: SectionContent) {
  return JSON.stringify({ itemIds: v.itemIds });
}

export async function listSections(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const fid = String(folderId);
  await requireFolderAccess(fid, me, "viewer");

  const sections = await prisma.folderItem.findMany({
    where: { folderId: fid, type: "section" },
    orderBy: { createdAt: "asc" },
    select: { id: true, folderId: true, title: true, content: true, createdAt: true, updatedAt: true },
  });

  const allIds = new Set<string>();
  for (const s of sections) {
    const { itemIds } = parseContent(s.content);
    itemIds.forEach((id) => allIds.add(id));
  }

  const items = allIds.size
    ? await prisma.folderItem.findMany({
        where: { id: { in: Array.from(allIds) } },
        select: { id: true, folderId: true, type: true, title: true, content: true, createdAt: true, updatedAt: true },
      })
    : [];

  const itemMap = new Map(items.map((i) => [i.id, i]));

  return sections.map((s) => {
    const { itemIds } = parseContent(s.content);
    return {
      id: s.id,
      folderId: s.folderId,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      itemIds,
      items: itemIds.map((id) => itemMap.get(id)).filter(Boolean),
    };
  });
}

export async function createSection(folderId: string, title: string) {
  const session = await auth();
  const me = requireEmail(session);

  const fid = String(folderId);
  await requireFolderAccess(fid, me, "editor");

  const created = await prisma.folderItem.create({
    data: {
      folderId: fid,
      type: "section",
      title: String(title).trim() || "Uusi osio",
      content: stringifyContent({ itemIds: [] }),
      createdBy: me,
      updatedAt: new Date(),
    },
    select: { id: true },
  });

  revalidatePath(`/app/folders/${fid}`);
  return created.id;
}

export async function renameSection(sectionItemId: string, title: string) {
  const session = await auth();
  const me = requireEmail(session);

  const s = await prisma.folderItem.findUnique({
    where: { id: String(sectionItemId) },
    select: { id: true, folderId: true, type: true },
  });
  if (!s || s.type !== "section") throw new Error("Section not found");

  await requireFolderAccess(s.folderId, me, "editor");

  await prisma.folderItem.update({
    where: { id: s.id },
    data: { title: String(title).trim() || "Osio", updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

export async function deleteSection(sectionItemId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const s = await prisma.folderItem.findUnique({
    where: { id: String(sectionItemId) },
    select: { id: true, folderId: true, type: true },
  });
  if (!s || s.type !== "section") return { ok: true };

  await requireFolderAccess(s.folderId, me, "editor");

  await prisma.folderItem.delete({ where: { id: s.id } });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

export async function attachItemToSection(sectionItemId: string, folderItemId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const s = await prisma.folderItem.findUnique({
    where: { id: String(sectionItemId) },
    select: { id: true, folderId: true, type: true, content: true },
  });
  if (!s || s.type !== "section") throw new Error("Section not found");

  await requireFolderAccess(s.folderId, me, "editor");

  const item = await prisma.folderItem.findUnique({
    where: { id: String(folderItemId) },
    select: { id: true, folderId: true },
  });
  if (!item || item.folderId !== s.folderId) throw new Error("Invalid item");

  const c = parseContent(s.content);
  const id = String(folderItemId);
  if (!c.itemIds.includes(id)) c.itemIds.push(id);

  await prisma.folderItem.update({
    where: { id: s.id },
    data: { content: stringifyContent(c), updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

export async function detachItemFromSection(sectionItemId: string, folderItemId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const s = await prisma.folderItem.findUnique({
    where: { id: String(sectionItemId) },
    select: { id: true, folderId: true, type: true, content: true },
  });
  if (!s || s.type !== "section") return { ok: true };

  await requireFolderAccess(s.folderId, me, "editor");

  const c = parseContent(s.content);
  const id = String(folderItemId);
  c.itemIds = c.itemIds.filter((x) => x !== id);

  await prisma.folderItem.update({
    where: { id: s.id },
    data: { content: stringifyContent(c), updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

export async function reorderSectionItems(sectionItemId: string, orderedFolderItemIds: string[]) {
  const session = await auth();
  const me = requireEmail(session);

  const s = await prisma.folderItem.findUnique({
    where: { id: String(sectionItemId) },
    select: { id: true, folderId: true, type: true, content: true },
  });
  if (!s || s.type !== "section") throw new Error("Section not found");

  await requireFolderAccess(s.folderId, me, "editor");

  const c = parseContent(s.content);
  const set = new Set(c.itemIds);

  // ✅ estää injektoimasta id:t joita ei ollut sectionissa
  const cleaned = orderedFolderItemIds.map(String).filter((id) => set.has(id));

  await prisma.folderItem.update({
    where: { id: s.id },
    data: { content: stringifyContent({ itemIds: cleaned }), updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

/* =========================================================
   Compatibility exports (older folder/[folderId]/page.tsx)
   - Näitä nimiä vanha page importtaa.
   - Ei sotketa varsinaisia "section" itemIds-osioita.
   - Tallennetaan JSON-blobeina omaan typeen: "section_json"
   ========================================================= */

export async function getFolderProfile(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);
  await requireFolderAccess(folderId, me, "viewer");

  const folder = await prisma.folder.findUnique({
    where: { id: String(folderId) },
    select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
  });

  if (!folder) throw new Error("Folder not found");
  return folder;
}

export async function getSection(folderId: string, key: string) {
  const session = await auth();
  const me = requireEmail(session);
  await requireFolderAccess(folderId, me, "viewer");

  const fid = String(folderId);
  const k = String(key).trim();

  const item = await prisma.folderItem.findFirst({
    where: { folderId: fid, type: "section_json", title: k },
    select: { id: true, folderId: true, title: true, content: true, createdAt: true, updatedAt: true },
  });

  return (
    item ?? {
      id: null,
      folderId: fid,
      title: k,
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
}

function safeJsonStringFromForm(formData: FormData, field: string) {
  const raw = String(formData.get(field) ?? "").trim();
  if (!raw) return "{}";
  try {
    JSON.parse(raw);
    return raw;
  } catch {
    return JSON.stringify({ text: raw });
  }
}

export async function saveSectionFromForm(formData: FormData) {
  const session = await auth();
  const me = requireEmail(session);

  const folderId = String(formData.get("folderId") ?? "").trim();
  const key = String(formData.get("key") ?? "").trim();
  const json = safeJsonStringFromForm(formData, "json");

  if (!folderId || !key) throw new Error("folderId/key missing");

  await requireFolderAccess(folderId, me, "editor");

  const existing = await prisma.folderItem.findFirst({
    where: { folderId, type: "section_json", title: key },
    select: { id: true },
  });

  if (existing) {
    await prisma.folderItem.update({
      where: { id: existing.id },
      data: { content: json, updatedAt: new Date(), createdBy: me },
    });
  } else {
    await prisma.folderItem.create({
      data: {
        folderId,
        type: "section_json",
        title: key,
        content: json,
        createdBy: me,
        updatedAt: new Date(),
      },
      select: { id: true },
    });
  }

  revalidatePath(`/app/folders/${folderId}`);
  return { ok: true };
}

export async function saveResultsJsonFromForm(formData: FormData) {
  const folderId = String(formData.get("folderId") ?? "").trim();
  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "results");
  fd.set("json", json);
  return saveSectionFromForm(fd);
}

export async function saveUpcomingJsonFromForm(formData: FormData) {
  const folderId = String(formData.get("folderId") ?? "").trim();
  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "upcoming");
  fd.set("json", json);
  return saveSectionFromForm(fd);
}

/**
 * ✅ Missing export fix for build:
 * Folder settings page imports `saveFolderProfileFromForm` from this module.
 * We'll store "profile" as a section_json blob (key: "profile").
 */
export async function saveFolderProfileFromForm(formData: FormData) {
  const folderId = String(formData.get("folderId") ?? "").trim();

  // Accept either "json" or "profile" field names from different forms
  const raw =
    formData.get("json") ??
    formData.get("profile") ??
    formData.get("data") ??
    "";

  const json = (() => {
    const s = String(raw ?? "").trim();
    if (!s) return "{}";
    try {
      JSON.parse(s);
      return s;
    } catch {
      return JSON.stringify({ text: s });
    }
  })();

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "profile");
  fd.set("json", json);

  return saveSectionFromForm(fd);
}
