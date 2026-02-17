import { auth } from "@/auth";
import Header from "./header";
import { getEntitlement } from "@/lib/access";

export default async function HeaderServer() {
  const session = await auth();
  const ent = await getEntitlement(session);

  return (
    <Header
      signedIn={!!session}
      hasPro={!!ent?.hasPro}
      status={ent?.status}
    />
  );
}
