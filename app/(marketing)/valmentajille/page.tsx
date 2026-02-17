// app/(marketing)/valmentajille/page.tsx
import type { Metadata } from "next";
import ValmentajillePage from "./ValmentajillePage";
import { valmentajilleContent } from "@/content/valmentajille";
import BackgroundVideo from "@/components/background/BackgroundVideo";

// jos teet CSS module -tiedoston, tää import on ok (ja voi olla tyhjä nyt)
import "./valmentajille.module.css";

export const metadata: Metadata = {
  title: valmentajilleContent.seo.title,
  description: valmentajilleContent.seo.description,
  alternates: { canonical: "/valmentajille" },
  openGraph: {
    title: valmentajilleContent.seo.title,
    description: valmentajilleContent.seo.description,
    url: "/valmentajille",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
  <BackgroundVideo />
  <ValmentajillePage content={valmentajilleContent} />
  </>
  )
}
