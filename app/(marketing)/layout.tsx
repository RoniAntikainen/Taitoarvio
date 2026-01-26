import type { Metadata } from "next";
import { SITE } from "@/content/site";
import Header from "@/components/layout/headers/header";
import Footer from "@/components/layout/footers/footer";
import "@/styles/site/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>
        <Header />
        <div id="app-shell">
          {children}

        </div>
        <Footer />
      </body>
    </html>
  );
}
