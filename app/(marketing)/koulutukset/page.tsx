// app/(marketing)/koulutukset/page.tsx
import type { Metadata } from "next";
import KoulutuksetPage from "./KoulutuksetPage";
import { koulutuksetContent } from "@/content/koulutukset";
import BackgroundVideo from "@/components/background/BackgroundVideo";

export const metadata: Metadata = {
  title: koulutuksetContent.seo.title,
  description: koulutuksetContent.seo.description,
  alternates: { canonical: "/koulutukset" },
  openGraph: {
    title: koulutuksetContent.seo.title,
    description: koulutuksetContent.seo.description,
    url: "/koulutukset",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <BackgroundVideo />
      <KoulutuksetPage content={koulutuksetContent} />
    </>
  );
}
