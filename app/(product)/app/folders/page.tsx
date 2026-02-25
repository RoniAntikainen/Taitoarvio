import Link from "next/link";
import { createFolder, listMyFolders } from "@/app/actions/folders";
import { redirect } from "next/navigation";
import "./folders.css";

export default async function FoldersPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const folders = await listMyFolders();

  const sp = searchParams ? await searchParams : undefined;
  const error = sp?.error ? decodeURIComponent(sp.error) : null;

  const memberships = folders.reduce((sum, folder) => sum + (folder.members?.length ?? 0), 0);
  const myStudentGroups = folders.filter((f) =>
    f.members.some((m) => m.role === "student")
  ).length;

  return (
    <div className="folders-page">
      <div className="folders-header">
        <div>
          <h1 className="folders-title">Ryhmäkansiot</h1>
          <p className="folders-lead">
            Hallitse valmennusryhmiä, oppilasrooleja ja yhteistä keskustelua yhdessä näkymässä.
          </p>
        </div>
        <Link href="/app">Takaisin</Link>
      </div>

      <section className="folders-stats">
        <article className="folders-stat">
          <span>Kansiot</span>
          <strong>{folders.length}</strong>
        </article>
        <article className="folders-stat">
          <span>Jäseniä yhteensä</span>
          <strong>{memberships}</strong>
        </article>
        <article className="folders-stat">
          <span>Oppilasryhmiä</span>
          <strong>{myStudentGroups}</strong>
        </article>
      </section>

      <form
        action={async (formData: FormData) => {
          "use server";

          const name = String(formData.get("name") ?? "").trim();
          const sportId = String(formData.get("sportId") ?? "football") as
            | "football"
            | "dance";
          const athleteName = String(formData.get("athleteName") ?? "").trim();

          if (!name) return;

          const result = await createFolder(name, sportId, athleteName);

          if (!result.ok) {
            const encoded = encodeURIComponent(result.error);
            redirect(`/app/folders?error=${encoded}`);
          }

          redirect("/app/folders");
        }}
        className="folders-form"
      >
        {error && <div className="folders-error">{error}</div>}

        <div className="form-field">
          <label>Kansion nimi</label>
          <input name="name" placeholder="Esim. Pakka – 2026" />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Oppilaan nimi</label>
            <input name="athleteName" placeholder="Esim. Pakka" />
          </div>

          <div className="form-field">
            <label>Laji</label>
            <select name="sportId" defaultValue="football">
              <option value="football">Jalkapallo</option>
              <option value="dance">Tanssi</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit">Luo kansio</button>
        </div>
      </form>

      {folders.length === 0 ? (
        <div className="folders-empty">Ei kansioita vielä.</div>
      ) : (
        <div className="folders-list">
          {folders.map((f) => (
            <Link key={f.id} href={`/app/folders/${f.id}`} className="folder-card">
              <div className="folder-row">
                <div className="folder-name">{f.name}</div>
                <span className="folder-role">Ryhmä</span>
              </div>
              <div className="folder-meta">
                Omistaja: {f.ownerId} · Jäseniä: {f.members?.length ?? 0}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
