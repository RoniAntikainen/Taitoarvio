import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const session = await auth();

  const next = searchParams?.next ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (session) {
    redirect(safeNext);
  }

  redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(safeNext)}`);
}
