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
      subject:
        patch.subject !== undefined
          ? String(patch.subject).trim() || "Arviointi"
          : undefined,
      evaluator:
        patch.evaluator !== undefined
          ? String(patch.evaluator).trim() || me
          : undefined,
      sportLabel:
        patch.sportLabel !== undefined
          ? String(patch.sportLabel ?? "").trim()
          : undefined,
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

/**
 * ✅ Form action that supports BOTH call styles:
 *  1) createFolderEvaluationFromForm(formData)
 *  2) createFolderEvaluationFromForm(folderId, formData)  <-- for bind(null, folderId)
 *
 * Returns Promise<void> so <form action={...}> typing is happy.
 */
export async function createFolderEvaluationFromForm(formData: FormData): Promise<void>;
export async function createFolderEvaluationFromForm(
  folderId: string,
  formData: FormData
): Promise<void>;
export async function createFolderEvaluationFromForm(
  a: FormData | string,
  b?: FormData
): Promise<void> {
  const formData = a instanceof FormData ? a : (b as FormData);
  const folderId =
    a instanceof FormData
      ? String(formData.get("folderId") ?? "").trim()
      : String(a).trim();

  if (!formData) throw new Error("formData missing");
  if (!folderId) throw new Error("folderId missing");

  const subject = String(formData.get("subject") ?? "").trim();
  const evaluator = String(formData.get("evaluator") ?? "").trim();

  // Sun page.tsx lähettää sportId hidden-fieldinä, ei sportLabel:
  const sportId = String(formData.get("sportId") ?? "").trim();
  const sportLabel = sportId ? sportId : String(formData.get("sportLabel") ?? "").trim();

  // Rakennetaan data samalla tavalla kuin sun UI (score:* + notes)
  const notes = String(formData.get("notes") ?? "").trim();

  const scores: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (!k.startsWith("score:")) continue;
    const area = k.slice("score:".length).trim();
    if (!area) continue;
    const val = String(v ?? "").trim();
    if (!val || val === "unrated") continue;
    scores[area] = val;
  }

  const data = { scores, notes };

  await createEvaluation({
    folderId,
    subject: subject || "Arviointi",
    evaluator: evaluator || undefined,
    sportLabel: sportLabel || "",
    data,
  });

  // createEvaluation tekee jo revalidatet, mutta ei haittaa jättää tyhjäksi tässä.
  return;
}
