"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsUpdateSchema, type UserSettingsDTO } from "@/lib/schemas/settings";

/** Käytetään formissa näkyviin kenttävirheisiin. */
export type SettingsFieldKey =
  | "defaultSportId"
  | "locale"
  | "timeZone"
  | "weekStartsOn"
  | "dateFormat"
  | "theme"
  | "reduceMotion"
  | "notificationsEmail"
  | "notificationsInApp"
  | "marketingConsent";

export type SettingsFieldErrors = Partial<Record<SettingsFieldKey, string>>;

export type SaveSettingsState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: SettingsFieldErrors };

function normalizeEmail(v: string) {
  return String(v || "").trim().toLowerCase();
}

export async function getMySettings(): Promise<UserSettingsDTO> {
  const session = await auth();
  const emailRaw = session?.user?.email;
  if (!emailRaw) throw new Error("Not authenticated");

  const email = normalizeEmail(emailRaw);

  const me = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      marketingConsent: true,
      settings: {
        select: {
          defaultSportId: true,
          locale: true,
          timeZone: true,
          weekStartsOn: true,
          dateFormat: true,
          theme: true,
          reduceMotion: true,
          notificationsEmail: true,
          notificationsInApp: true,
        },
      },
    },
  });

  if (!me) throw new Error("User not found");

  const s =
    me.settings ??
    (await prisma.userSettings.create({
      data: { userId: me.id },
      select: {
        defaultSportId: true,
        locale: true,
        timeZone: true,
        weekStartsOn: true,
        dateFormat: true,
        theme: true,
        reduceMotion: true,
        notificationsEmail: true,
        notificationsInApp: true,
      },
    }));

  return {
    defaultSportId: s.defaultSportId,
    locale: s.locale,
    timeZone: s.timeZone,
    weekStartsOn: s.weekStartsOn,
    dateFormat: s.dateFormat,
    theme: (s.theme as any) ?? "system",
    reduceMotion: s.reduceMotion,
    notificationsEmail: s.notificationsEmail,
    notificationsInApp: s.notificationsInApp,
    marketingConsent: me.marketingConsent,
  };
}

export async function saveMySettings(
  _prev: SaveSettingsState | null,
  fd: FormData
): Promise<SaveSettingsState> {
  const session = await auth();
  const emailRaw = session?.user?.email;
  if (!emailRaw) return { ok: false, message: "Et ole kirjautunut." };

  const email = normalizeEmail(emailRaw);

  // FormData -> "raw" input (pidetään stringit / booleans, schema hoitaa loput)
  const raw = {
    defaultSportId: fd.get("defaultSportId") ?? undefined,
    locale: fd.get("locale") ?? undefined,
    timeZone: fd.get("timeZone") ?? undefined,
    weekStartsOn: fd.get("weekStartsOn") ?? undefined,
    dateFormat: fd.get("dateFormat") ?? undefined,
    theme: fd.get("theme") ?? undefined,

    reduceMotion: fd.get("reduceMotion") ? true : false,
    notificationsEmail: fd.get("notificationsEmail") ? true : false,
    notificationsInApp: fd.get("notificationsInApp") ? true : false,
    marketingConsent: fd.get("marketingConsent") ? true : false,
  };

  const parsed = SettingsUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: SettingsFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "") as SettingsFieldKey;
      if (k) fieldErrors[k] = issue.message;
    }
    return {
      ok: false,
      message: "Tarkista asetukset ja yritä uudelleen.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  const me = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!me) return { ok: false, message: "Käyttäjää ei löytynyt." };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: me.id },
      data: {
        marketingConsent: data.marketingConsent ?? false,
        marketingConsentAt: data.marketingConsent ? new Date() : null,
      },
    }),
    prisma.userSettings.upsert({
      where: { userId: me.id },
      create: {
        userId: me.id,
        defaultSportId: data.defaultSportId ?? "dance",
        locale: data.locale ?? "fi",
        timeZone: data.timeZone ?? "Europe/Helsinki",
        weekStartsOn: data.weekStartsOn ?? 1,
        dateFormat: data.dateFormat ?? "yyyy-MM-dd",
        theme: (data.theme as any) ?? "system",
        reduceMotion: data.reduceMotion ?? false,
        notificationsEmail: data.notificationsEmail ?? true,
        notificationsInApp: data.notificationsInApp ?? true,
      },
      update: {
        ...(data.defaultSportId !== undefined ? { defaultSportId: String(data.defaultSportId) } : null),
        ...(data.locale !== undefined ? { locale: String(data.locale) } : null),
        ...(data.timeZone !== undefined ? { timeZone: String(data.timeZone) } : null),
        ...(data.weekStartsOn !== undefined ? { weekStartsOn: Number(data.weekStartsOn) } : null),
        ...(data.dateFormat !== undefined ? { dateFormat: String(data.dateFormat) } : null),
        ...(data.theme !== undefined ? { theme: String(data.theme) } : null),
        ...(data.reduceMotion !== undefined ? { reduceMotion: Boolean(data.reduceMotion) } : null),
        ...(data.notificationsEmail !== undefined ? { notificationsEmail: Boolean(data.notificationsEmail) } : null),
        ...(data.notificationsInApp !== undefined ? { notificationsInApp: Boolean(data.notificationsInApp) } : null),
      },
    }),
  ]);

  return { ok: true, message: "Asetukset tallennettu." };
}