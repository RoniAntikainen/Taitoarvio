import { auth } from "@/auth";

export default async function AppHome() {
  const session = await auth();
  const defaultName = session?.user?.name ?? "";

  return (
    <div>
      <h1>Taitoarvio</h1>
      <section className="homeInquiry">
      </section>
    </div>
  );
}
