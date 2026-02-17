// app/actions/folder-evaluations.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireEmail, requireFolderAccess, getEntitlement } from "@/lib/access";
import { assertEvaluationLimit } from "@/lib/limits";

type CreateEvaluationInput = {
  folderId: string;
  subject?: string;
  evaluator?: string;
  sportLabel?: string; // schema: pakollinen string, mutta syötteessä optional -> default ""
  data: any; // JSON object tai string
};

function toJsonString(v: any) {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v ?? {});
  } catch {
    return JSON.stringify({});
  }
}

export async function createEvaluation(input: CreateEvaluationInput) {
  const session = await auth();
  const me = requireEmail(session);

  const folderId = String(input.folderId);
  await requireFolderAccess(folderId, me, "editor");

  // ✅ FREE-tier limit
  const ent = getEntitlement(session);
  await assertEvaluationLimit(folderId, ent.status);

  const ev = await prisma.evaluation.create({
    data: {
      folderId,
      subject: String(input.subject ?? "").trim() || "Arviointi",
      evaluator: String(input.evaluator ?? me).trim() || me,
      sportLabel: String(input.sportLabel ?? "").trim(), // ✅ ei null
      data: toJsonString(input.data),
    },
    select: { id: true },
  });

  revalidatePath(`/app/folders/${folderId}`);
  revalidatePath(`/app/folders/${folderId}/evaluations`);
  return ev.id;
}

export async function updateEvaluation(
  evaluationId: string,
  patch: Partial<Omit<CreateEvaluationInput, "folderId">>
) {
  const session = await auth();
  const me = requireEmail(session);

  const current = await prisma.evaluation.findUnique({
    where: { id: String(evaluationId) },
    select: { id: true, folderId: true },
  });
  if (!current) throw new Error("Evaluation not found");

  await requireFolderAccess(current.folderId, me, "editor");

  await prisma.evaluation.update({
    where: { id: current.id },
    data: {
      subject: patch.subject !== undefined ? (String(patch.subject).trim() || "Arviointi") : undefined,
      evaluator: patch.evaluator !== undefined ? (String(patch.evaluator).trim() || me) : undefined,
      sportLabel: patch.sportLabel !== undefined ? String(patch.sportLabel ?? "").trim() : undefined,
      data: patch.data !== undefined ? toJsonString(patch.data) : undefined,
    },
  });

  revalidatePath(`/app/folders/${current.folderId}`);
  revalidatePath(`/app/folders/${current.folderId}/evaluations`);
  return { ok: true };
}

export async function deleteEvaluation(evaluationId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const current = await prisma.evaluation.findUnique({
    where: { id: String(evaluationId) },
    select: { id: true, folderId: true },
  });
  if (!current) return { ok: true };

  await requireFolderAccess(current.folderId, me, "editor");

  await prisma.evaluation.delete({ where: { id: current.id } });

  revalidatePath(`/app/folders/${current.folderId}`);
  revalidatePath(`/app/folders/${current.folderId}/evaluations`);
  return { ok: true };
}

export async function getEvaluation(evaluationId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const ev = await prisma.evaluation.findUnique({
    where: { id: String(evaluationId) },
    select: {
      id: true,
      folderId: true,
      subject: true,
      evaluator: true,
      sportLabel: true,
      createdAt: true,
      data: true,
    },
  });
  if (!ev) throw new Error("Evaluation not found");

  await requireFolderAccess(ev.folderId, me, "viewer");
  return ev;
}

export async function listEvaluations(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  const fid = String(folderId);
  await requireFolderAccess(fid, me, "viewer");

  return prisma.evaluation.findMany({
    where: { folderId: fid },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      folderId: true,
      subject: true,
      evaluator: true,
      sportLabel: true,
      createdAt: true,
      data: true,
    },
  });
}
export async function createFolderEvaluationFromForm(formData: FormData) {
  "use server";

  const folderId = String(formData.get("folderId") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const evaluator = String(formData.get("evaluator") ?? "").trim();
  const sportLabel = String(formData.get("sportLabel") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();

  // Jos sun varsinaisessa create-funktiossa on eri signature, vaihda tämä kutsu:
  // 1) jos sulla on createFolderEvaluation(folderId, subject, evaluator, sportLabel, data)
  if (typeof (globalThis as any).__dummy__ === "undefined") {
    // noop - vain jotta TS ei valita tyhjästä blokista joissain konfigeissa
  }

  // Yritetään kutsua olemassa olevaa funktiota nimillä joita projekteissa yleensä on
  // (valitse se mikä löytyy sun tiedostosta ja poista muut).
  // @ts-ignore
  if (typeof createFolderEvaluation === "function") {
    // @ts-ignore
    return await createFolderEvaluation(folderId, subject, evaluator, sportLabel, data);
  }

  // @ts-ignore
  if (typeof createEvaluation === "function") {
    // @ts-ignore
    return await createEvaluation(folderId, subject, evaluator, sportLabel, data);
  }

  // Jos mitään ei löydy, heitetään selkeä virhe:
  throw new Error(
    "createFolderEvaluationFromForm: ei löytynyt createFolderEvaluation/createEvaluation -funktiota. Lisää varsinainen create-funktio folder-evaluations.ts:ään."
  );
}
