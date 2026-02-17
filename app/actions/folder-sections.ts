// app/actions/folder-sections.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireEmail, requireFolderAccess } from "@/lib/access";

/**
 * Tämä tiedosto on käytössä sekä uusissa että vanhoissa sivuissa.
 * Osa sivuista käyttää server actioneita suoraan (action={fn}),
 * osa bindaa folderId/key etukäteen (action={fn.bind(null, folderId, key)}).
 *
 * -> Siksi actionit tukevat molempia allekirjoituksia.
 */

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

// ----------------------
// Newer "section" itemIds -osioita
// ----------------------

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

  const itemMap = new Map(items.map((i) => [i.id, i] as const));

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

// ----------------------
// Compatibility exports (older pages)
// - tallennetaan JSON-blobeina folderItem type="section_json" (title = key)
// - profiili on folderItem type="profile" (title "Profiili")
// ----------------------

type Profile = {
  folderId: string;
  athleteName: string;
  sportId: "football" | "dance";
};

function safeParseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return fallback;
    try {
      return (JSON.parse(s) ?? fallback) as T;
    } catch {
      return fallback;
    }
  }
  if (typeof raw === "object") return (raw as T) ?? fallback;
  return fallback;
}

export async function getFolderProfile(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);
  await requireFolderAccess(folderId, me, "viewer");

  const fid = String(folderId);

  const folder = await prisma.folder.findUnique({
    where: { id: fid },
    select: { id: true, name: true, ownerId: true, createdAt: true, updatedAt: true },
  });
  if (!folder) throw new Error("Folder not found");

  const profileItem = await prisma.folderItem.findFirst({
    where: { folderId: fid, type: "profile" },
    orderBy: { createdAt: "asc" },
    select: { content: true },
  });

  const p = safeParseJson<Partial<Profile>>(profileItem?.content, {});
  const sportId = (p.sportId === "dance" ? "dance" : "football") as "football" | "dance";
  const athleteName = typeof p.athleteName === "string" ? p.athleteName : "";

  return {
    ...folder,
    sportId,
    athleteName,
  };
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

export async function saveSectionFromForm(folderId: string, key: string, formData: FormData): Promise<void>;
export async function saveSectionFromForm(formData: FormData): Promise<void>;
export async function saveSectionFromForm(a: any, b?: any, c?: any): Promise<void> {
  const session = await auth();
  const me = requireEmail(session);

  let folderId: string;
  let key: string;
  let json: string;

  if (a instanceof FormData) {
    const formData = a;
    folderId = String(formData.get("folderId") ?? "").trim();
    key = String(formData.get("key") ?? "").trim();
    json = safeJsonStringFromForm(formData, "json");
  } else {
    folderId = String(a ?? "").trim();
    key = String(b ?? "").trim();
    const formData = c as FormData;

    // Vanhoissa sivuissa (esim. "plan") tallennetaan plain text suoraan content-kenttään.
    // Muissa JSON-sektioissa käytetään dedicated actioneita (saveUpcomingJsonFromForm/saveResultsJsonFromForm).
    json = String(formData.get("content") ?? formData.get("text") ?? "");
  }

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
}

export async function saveResultsJsonFromForm(folderId: string, formData: FormData): Promise<void>;
export async function saveResultsJsonFromForm(formData: FormData): Promise<void>;
export async function saveResultsJsonFromForm(a: any, b?: any): Promise<void> {
  const formData = a instanceof FormData ? a : (b as FormData);
  const folderId = a instanceof FormData ? String(formData.get("folderId") ?? "").trim() : String(a ?? "").trim();
  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "results");
  fd.set("json", json);
  await saveSectionFromForm(fd);
}

export async function saveUpcomingJsonFromForm(folderId: string, formData: FormData): Promise<void>;
export async function saveUpcomingJsonFromForm(formData: FormData): Promise<void>;
export async function saveUpcomingJsonFromForm(a: any, b?: any): Promise<void> {
  const formData = a instanceof FormData ? a : (b as FormData);
  const folderId = a instanceof FormData ? String(formData.get("folderId") ?? "").trim() : String(a ?? "").trim();
  const json = safeJsonStringFromForm(formData, "json");

  const fd = new FormData();
  fd.set("folderId", folderId);
  fd.set("key", "upcoming");
  fd.set("json", json);
  await saveSectionFromForm(fd);
}

export async function saveFolderProfileFromForm(folderId: string, formData: FormData): Promise<void>;
export async function saveFolderProfileFromForm(formData: FormData): Promise<void>;
export async function saveFolderProfileFromForm(a: any, b?: any): Promise<void> {
  const session = await auth();
  const me = requireEmail(session);

  const formData = a instanceof FormData ? a : (b as FormData);
  const folderId = a instanceof FormData ? String(formData.get("folderId") ?? "").trim() : String(a ?? "").trim();
  if (!folderId) throw new Error("folderId missing");
  await requireFolderAccess(folderId, me, "editor");

  const athleteName = String(formData.get("athleteName") ?? "").trim();
  const sportIdRaw = String(formData.get("sportId") ?? "football").trim();
  const sportId = sportIdRaw === "dance" ? "dance" : "football";
  const content = JSON.stringify({ athleteName, sportId });

  const existing = await prisma.folderItem.findFirst({
    where: { folderId, type: "profile" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (existing) {
    await prisma.folderItem.update({
      where: { id: existing.id },
      data: { content, updatedAt: new Date(), createdBy: me },
    });
  } else {
    await prisma.folderItem.create({
      data: {
        folderId,
        type: "profile",
        title: "Profiili",
        content,
        createdBy: me,
        updatedAt: new Date(),
      },
      select: { id: true },
    });
  }

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath(`/app/folders/${folderId}/settings`);
}
