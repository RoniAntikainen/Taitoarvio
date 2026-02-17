// app/api/home/route.ts
import { NextResponse } from "next/server";
import { getHomeDashboardData } from "@/app/actions/home";
import { HomeDashboardSchema } from "@/lib/schemas/home";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getHomeDashboardData();
  const parsed = HomeDashboardSchema.parse(data);
  return NextResponse.json(parsed);
}
