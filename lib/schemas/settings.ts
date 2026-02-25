import * as z from "zod";

export const ThemeSchema = z.enum(["system", "light", "dark"]);
export type Theme = z.infer<typeof ThemeSchema>;

export const WeekStartsOnSchema = z.coerce.number().int().min(0).max(6);

export const SettingsUpdateSchema = z.object({
  defaultSportId: z.string().min(1).optional(),
  locale: z.string().min(2).max(10).optional(),
  timeZone: z.string().min(3).max(64).optional(),
  weekStartsOn: WeekStartsOnSchema.optional(),
  dateFormat: z.string().min(4).max(32).optional(),
  theme: ThemeSchema.optional(),
  reduceMotion: z.coerce.boolean().optional(),
  notificationsEmail: z.coerce.boolean().optional(),
  notificationsInApp: z.coerce.boolean().optional(),
  marketingConsent: z.coerce.boolean().optional(),
});

export type UserSettingsDTO = {
  defaultSportId: string;
  locale: string;
  timeZone: string;
  weekStartsOn: number;
  dateFormat: string;
  theme: Theme;
  reduceMotion: boolean;
  notificationsEmail: boolean;
  notificationsInApp: boolean;
  marketingConsent: boolean;
};