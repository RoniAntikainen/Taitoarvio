import { prisma } from "@/lib/prisma";
import { decodeUnsubscribeToken } from "@/lib/unsubscribe";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Peruuta sähköpostit",
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { t?: string };
}) {
  const token = searchParams?.t;

  if (!token) {
    return (
      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <h1>Linkki puuttuu</h1>
        <p>Unsubscribe-linkki on virheellinen.</p>
      </main>
    );
  }

  const decoded = decodeUnsubscribeToken(token);
  if (!decoded?.email) {
    return (
      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <h1>Linkki ei kelpaa</h1>
        <p>Unsubscribe-linkki on virheellinen tai vanhentunut.</p>
      </main>
    );
  }

  await prisma.user.updateMany({
    where: { email: decoded.email },
    data: {
      marketingConsent: false,
      marketingConsentAt: null,
      unsubscribedAt: new Date(),
    },
  });

  return (
    <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Onnistui</h1>
      <p>Sähköpostimarkkinointi on nyt peruttu osoitteelle: <b>{decoded.email}</b>.</p>
    </main>
  );
}
