// app/actions/students.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireEmail } from "@/lib/access";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return "Tuntematon virhe";
}

export async function listMyStudents() {
  const session = await auth();
  const me = requireEmail(session);

  return prisma.student.findMany({
    where: { ownerId: me },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      sportId: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getStudent(id: string) {
  const session = await auth();
  const me = requireEmail(session);

  const st = await prisma.student.findFirst({
    where: { id: String(id), ownerId: me },
  });

  if (!st) throw new Error("Oppilasta ei löytynyt");
  return st;
}

export async function createStudent(
  name: string,
  sportId: "football" | "dance",
  notes: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    const me = requireEmail(session);

    const nm = String(name ?? "").trim();
    if (!nm) return { ok: false, error: "Oppilaan nimi puuttuu." };

    const st = await prisma.student.create({
      data: {
        ownerId: me,
        name: nm,
        sportId: sportId === "dance" ? "dance" : "football",
        notes: String(notes ?? "").trim(),
      },
      select: { id: true },
    });

    revalidatePath("/app/students");
    return { ok: true, data: { id: st.id } };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function updateStudent(
  id: string,
  patch: { name?: string; sportId?: "football" | "dance"; notes?: string }
): Promise<ActionResult<{ ok: true }>> {
  try {
    const session = await auth();
    const me = requireEmail(session);

    const current = await prisma.student.findFirst({
      where: { id: String(id), ownerId: me },
      select: { id: true },
    });
    if (!current) return { ok: false, error: "Oppilasta ei löytynyt." };

    const data: any = {};
    if (patch.name !== undefined) {
      const nm = String(patch.name).trim();
      if (!nm) return { ok: false, error: "Oppilaan nimi ei voi olla tyhjä." };
      data.name = nm;
    }
    if (patch.sportId !== undefined) {
      data.sportId = patch.sportId === "dance" ? "dance" : "football";
    }
    if (patch.notes !== undefined) {
      data.notes = String(patch.notes ?? "").trim();
    }

    await prisma.student.update({ where: { id: current.id }, data });
    revalidatePath("/app/students");
    revalidatePath(`/app/students/${current.id}`);
    return { ok: true, data: { ok: true } };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function deleteStudent(id: string): Promise<ActionResult<{ ok: true }>> {
  try {
    const session = await auth();
    const me = requireEmail(session);

    const current = await prisma.student.findFirst({
      where: { id: String(id), ownerId: me },
      select: { id: true },
    });
    if (!current) return { ok: true, data: { ok: true } };

    await prisma.student.delete({ where: { id: current.id } });

    revalidatePath("/app/students");
    return { ok: true, data: { ok: true } };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}
