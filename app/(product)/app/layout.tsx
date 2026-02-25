// app/(product)/app/layout.tsx
import AppShell from "@/components/shell/AppShell";
import "@/styles/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={inter.variable}>
      <body data-scope="app">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
} 