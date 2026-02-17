import type { Metadata } from "next";
import { SITE } from "@/content/site";
import HeaderServer from "@/components/layout/headers/HeaderServer";
import Footer from "@/components/layout/footers/footer";
import "@/styles/site/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body data-scope="marketing">
        <HeaderServer />
        <div id="app-shell">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
