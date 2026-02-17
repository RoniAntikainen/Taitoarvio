// lib/schemas/home.ts
import * as z from "zod";

// Zod: skeeman määrittely + parse + tyyppien inferointi. citeturn1search0turn1search1
export const AppRoleSchema = z.enum(["ADMIN", "COACH", "ATHLETE"]);
export type AppRole = z.infer<typeof AppRoleSchema>;

export const RecentEvaluationSchema = z.object({
  id: z.string(),
  folderId: z.string(),
  folderName: z.string(),
  subject: z.string(),
  evaluator: z.string().nullable(),
  sportLabel: z.string(),
  createdAt: z.string(), // ISO
});

export const HomeDashboardSchema = z.object({
  user: z.object({
    name: z.string().nullable(),
    email: z.string().email(),
    role: AppRoleSchema,
  }),
  counts: z.object({
    folders: z.number().int().nonnegative(),
    unreadNotifications: z.number().int().nonnegative(),
    evaluationsThisWeek: z.number().int().nonnegative(),
    evaluationsTotal: z.number().int().nonnegative(),
  }),
  week: z.object({
    start: z.string(),
    end: z.string(),
  }),
  recentEvaluations: z.array(RecentEvaluationSchema),
});

export type HomeDashboardData = z.infer<typeof HomeDashboardSchema>;
