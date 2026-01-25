import AppShell from "@/components/shell/AppShell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin?callbackUrl=/app");

  return <AppShell>{children}</AppShell>;
}
