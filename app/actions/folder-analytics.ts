"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireEmail, requireFolderAccess } from "@/lib/access";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function safeParseJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function extractScores(evaluationData: any): number[] {
  // Sun data näyttää olevan JSON string evaluation.data
  // Tämä yrittää hakea numerot “deep” ilman että oletetaan liikaa rakennetta.
  const out: number[] = [];
  const stack = [evaluationData];

  while (stack.length) {
    const x = stack.pop();
    if (x == null) continue;

    if (typeof x === "number" && Number.isFinite(x)) out.push(x);
    else if (Array.isArray(x)) for (const it of x) stack.push(it);
    else if (typeof x === "object") for (const k of Object.keys(x)) stack.push((x as any)[k]);
  }

  // Heuristiikka: jos on ihan liikaa numeroita (esim. timestampit),
  // voi suodattaa välille 0..10 (tyypillinen score). Muuta tarvittaessa.
  const filtered = out.filter((n) => n >= 0 && n <= 10);
  return filtered.length ? filtered : out;
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export async function getFolderAnalytics(folderId: string) {
  const session = await auth();
  const me = requireEmail(session);

  await requireFolderAccess(folderId, me, "viewer");

  const evaluations = await prisma.evaluation.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, data: true, subject: true, evaluator: true },
    take: 200,
  });

  const allScores: number[] = [];
  const scores7: number[] = [];
  const scores30: number[] = [];

  const cut7 = daysAgo(7).getTime();
  const cut30 = daysAgo(30).getTime();

  for (const ev of evaluations) {
    const parsed = safeParseJson(ev.data);
    const scores = extractScores(parsed);

    allScores.push(...scores);

    const t = new Date(ev.createdAt).getTime();
    if (t >= cut7) scores7.push(...scores);
    if (t >= cut30) scores30.push(...scores);
  }

  // Jakauma 0-10
  const dist: Record<string, number> = {};
  for (let i = 0; i <= 10; i++) dist[String(i)] = 0;
  for (const s of allScores) {
    const k = String(Math.round(s));
    if (dist[k] != null) dist[k] += 1;
  }

  // Trend: viimeiset 10 evalia → avg per eval
  const trend = evaluations
    .slice(0, 10)
    .map((ev) => {
      const parsed = safeParseJson(ev.data);
      const scores = extractScores(parsed);
      return {
        id: ev.id,
        at: ev.createdAt.toISOString(),
        value: avg(scores),
        subject: ev.subject,
      };
    })
    .reverse();

  return {
    counts: {
      evaluations: evaluations.length,
      scores: allScores.length,
    },
    avgAll: avg(allScores),
    avg7: avg(scores7),
    avg30: avg(scores30),
    dist,
    trend,
  };
}
