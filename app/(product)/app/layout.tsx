// app/(product)/app/layout.tsx
import AppShell from "@/components/shell/AppShell";
import "@/styles/app/globals.css";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // AppShell aina -> navigointi aina näkyy kaikkialla /app:ssa
  return (
    <html lang="fi">
      <body data-scope="app">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
