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

/* =========================================================
   Section list (type: "section") + itemIds
   ========================================================= */

export async function listSections(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const fid = String(folderId);
  await requireFolderAccess(fid, me, "viewer");

  const sections = await prisma.folderItem.findMany({
    where: { folderId: fid, type: "section" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      folderId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const allIds = new Set<string>();
  for (const s of sections) {
    const { itemIds } = parseContent(s.content);
    itemIds.forEach((id) => allIds.add(id));
  }

  const items = allIds.size
    ? await prisma.folderItem.findMany({
        where: { id: { in: Array.from(allIds) } },
        select: {
          id: true,
          folderId: true,
          type: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
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

  const cleaned = orderedFolderItemIds.map(String).filter((id) => set.has(id));

  await prisma.folderItem.update({
    where: { id: s.id },
    data: { content: stringifyContent({ itemIds: cleaned }), updatedAt: new Date() },
  });

  revalidatePath(`/app/folders/${s.folderId}`);
  return { ok: true };
}

/* =========================================================
   JSON blobs stored as folderItem(type: "section_json", title: key)
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

/**
 * ✅ Supports BOTH:
 *  1) saveSectionFromForm(formData)
 *  2) saveSectionFromForm(folderId, key, formData)  <-- for bind(null, folderId, "plan")
 * Must return Promise<void> for <form action={...}> typing.
 */
export async function saveSectionFromForm(formData: FormData): Promise<void>;
export async function saveSectionFromForm(folderId: string, key: string, formData: FormData): Promise<void>;
export async function saveSectionFromForm(
  a: FormData | string,
  b?: string,
  c?: FormData
): Promise<void> {
  const session = await auth();
  const me = requireEmail(session);

  let formData: FormData;
  let folderId: string;
  let key: string;

  if (a instanceof FormData) {
    // Style #1
    formData = a;
    folderId = String(formData.get("folderId") ?? "").trim();
    key = String(formData.get("key") ?? "").trim();
  } else {
    // Style #2
    folderId = String(a).trim();
    key = String(b ?? "").trim();
    formData = c as FormData;
  }

  if (!formData) throw new Error("formData missing");
  if (!folderId || !key) throw new Error("folderId/key missing");

  // If "json" exists => JSON blob.
  // Else use "content" (textarea) and store as JSON { text }.
  const json =
    formData.get("json") != null
      ? safeJsonStringFromForm(formData, "json")
      : JSON.stringify({ text: String(formData.get("content") ?? "") });

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
}

/**
 * ✅ Supports BOTH:
 *  1) saveResultsJsonFromForm(formData)
 *  2) saveResultsJsonFromForm(folderId, formData)   <-- for bind(null, folderId)
 */
export async function saveResultsJsonFromForm(formData: FormData): Promise<void>;
export async function saveResultsJsonFromForm(folderId: string, formData: FormData): Promise<void>;
export async function saveResultsJsonFromForm(
  a: FormData | string,
  b?: FormData
): Promise<void> {
  const folderId = a instanceof FormData ? String(a.get("folderId") ?? "").trim() : String(a).trim();
  const formData = a instanceof FormData ? a : (b as FormData);

  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "results");
  fd.set("json", json);

  await saveSectionFromForm(fd);
}

/**
 * ✅ Supports BOTH:
 *  1) saveUpcomingJsonFromForm(formData)
 *  2) saveUpcomingJsonFromForm(folderId, formData)  <-- for bind(null, folderId)
 */
export async function saveUpcomingJsonFromForm(formData: FormData): Promise<void>;
export async function saveUpcomingJsonFromForm(folderId: string, formData: FormData): Promise<void>;
export async function saveUpcomingJsonFromForm(
  a: FormData | string,
  b?: FormData
): Promise<void> {
  const folderId = a instanceof FormData ? String(a.get("folderId") ?? "").trim() : String(a).trim();
  const formData = a instanceof FormData ? a : (b as FormData);

  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "upcoming");
  fd.set("json", json);

  await saveSectionFromForm(fd);
}

/**
 * ✅ Folder settings page expects this export.
 * Stored as section_json key "profile".
 */
export async function saveFolderProfileFromForm(formData: FormData): Promise<void> {
  const folderId = String(formData.get("folderId") ?? "").trim();

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

  await saveSectionFromForm(fd);
}
