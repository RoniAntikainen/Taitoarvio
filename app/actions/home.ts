// app/actions/home.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type RecentEvaluation = {
  id: string;
  folderId: string;
  folderName: string;
  subject: string;
  evaluator: string;
  sportLabel: string;
  createdAt: string; // ISO
};

export type HomeDashboardData = {
  user: { name: string | null; email: string };
  counts: {
    folders: number;
    unreadNotifications: number;
    evaluationsThisWeek: number;
    evaluationsTotal: number;
  };
  week: { start: string; end: string }; // ISO (UTC)
  recentEvaluations: RecentEvaluation[];
};

function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

function startOfIsoWeekUtc(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  const day = x.getUTCDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // Monday => 0
  x.setUTCDate(x.getUTCDate() - diff);
  return x;
}

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const session = await auth();
  const emailRaw = session?.user?.email;
  if (!emailRaw) throw new Error("Not authenticated");

  const email = normalizeEmail(emailRaw);

  // näkyvyys: omistaja (ownerId=email) TAI jäsen (FolderMember.userEmail=email)
  const folderAccessWhere = {
    OR: [{ ownerId: email }, { members: { some: { userEmail: email } } }],
  };

  const weekStart = startOfIsoWeekUtc(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const [me, folders, unreadNotifications, evaluationsThisWeek, evaluationsTotal, recent] =
    await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { name: true, email: true },
      }),
      prisma.folder.count({ where: folderAccessWhere }),
      prisma.notification.count({ where: { userEmail: email, readAt: null } }),
      prisma.evaluation.count({
        where: {
          createdAt: { gte: weekStart, lt: weekEnd },
          folder: folderAccessWhere,
        },
      }),
      prisma.evaluation.count({
        where: { folder: folderAccessWhere },
      }),
      prisma.evaluation.findMany({
        where: { folder: folderAccessWhere },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          subject: true,
          evaluator: true,
          sportLabel: true,
          createdAt: true,
          folder: { select: { id: true, name: true } },
        },
      }),
    ]);

  return {
    user: {
      name: me?.name ?? session?.user?.name ?? null,
      email: me?.email ?? email,
    },
    counts: { folders, unreadNotifications, evaluationsThisWeek, evaluationsTotal },
    week: { start: weekStart.toISOString(), end: weekEnd.toISOString() },
    recentEvaluations: recent.map((e) => ({
      id: e.id,
      folderId: e.folder.id,
      folderName: e.folder.name,
      subject: e.subject,
      evaluator: e.evaluator,
      sportLabel: e.sportLabel,
      createdAt: e.createdAt.toISOString(),
    })),
  };
}
