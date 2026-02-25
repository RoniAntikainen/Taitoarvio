import Link from "next/link";
import { createFolder, listMyFolders } from "@/app/actions/folders";
import { redirect } from "next/navigation";
import "./folders.css";

function roleLabel(role: string) {
  if (role === "owner") return "Omistaja";
  if (role === "editor") return "Valmentaja";
  if (role === "student") return "Oppilas";
  return "Katsoja";
}

function roleClass(role: string) {
  if (role === "owner") return "owner";
  if (role === "editor") return "editor";
  if (role === "student") return "student";
  return "viewer";
}

export default async function FoldersPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; q?: string; role?: string }>;
}) {
  const folders = await listMyFolders();

  const sp = searchParams ? await searchParams : undefined;
  const error = sp?.error ? decodeURIComponent(sp.error) : null;
  const q = String(sp?.q ?? "").trim().toLowerCase();
  const role = String(sp?.role ?? "all");

  const visibleFolders = folders.filter((folder) => {
    const roleOk = role === "all" ? true : folder.myRole === role;
    const searchOk =
      q.length === 0
        ? true
        : `${folder.name} ${folder.ownerId}`.toLowerCase().includes(q);
    return roleOk && searchOk;
  });

  const memberships = folders.reduce(
    (sum, folder) => sum + (folder.members?.length ?? 0),
    0
  );
  const studentGroups = folders.filter((f) => f.myRole === "student").length;
  const editorGroups = folders.filter(
    (f) => f.myRole === "editor" || f.myRole === "owner"
  ).length;

  return (
    <div className="folders-page">
      <div className="folders-header">
        <div>
          <h1 className="folders-title">Ryhmäkansiot</h1>
          <p className="folders-lead">
            Yksi näkymä valmentajille ja oppilaille: suunnitelmat, tulokset,
            keskustelu ja tapaamiset.
          </p>
        </div>

        <div className="folders-headerActions">
          <Link href="/app/calendar">Kalenteri</Link>
          <Link href="/app">Takaisin kotiin</Link>
        </div>
      </div>

      <section className="folders-stats" aria-label="Yhteenveto">
        <article className="folders-stat">
          <span>Kansiot</span>
          <strong>{folders.length}</strong>
          <small>Sinulle jaetut ryhmät</small>
        </article>
        <article className="folders-stat">
          <span>Muokattavat</span>
          <strong>{editorGroups}</strong>
          <small>Omistaja + valmentaja roolit</small>
        </article>
        <article className="folders-stat">
          <span>Oppilasryhmät</span>
          <strong>{studentGroups}</strong>
          <small>Seuraa sisältöjä ja kommentoi</small>
        </article>
        <article className="folders-stat">
          <span>Jäseniä yhteensä</span>
          <strong>{memberships}</strong>
          <small>Kaikki ihmiset kansioissa</small>
        </article>
      </section>

      <form action="/app/folders" className="folders-filterForm">
        <div className="form-field">
          <label>Hae kansioita</label>
          <input
            type="search"
            name="q"
            placeholder="Hae nimellä tai omistajan sähköpostilla"
            defaultValue={sp?.q ?? ""}
          />
        </div>

        <div className="form-field">
          <label>Roolisuodatin</label>
          <select name="role" defaultValue={role}>
            <option value="all">Kaikki roolit</option>
            <option value="owner">Omistaja</option>
            <option value="editor">Valmentaja</option>
            <option value="student">Oppilas</option>
            <option value="viewer">Katsoja</option>
          </select>
        </div>

        <div className="folders-filterActions">
          <button type="submit">Suodata</button>
          <Link href="/app/folders">Tyhjennä</Link>
        </div>
      </form>

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

          redirect(`/app/folders/${result.data.folderId}`);
        }}
        className="folders-form"
      >
        {error && <div className="folders-error">{error}</div>}

        <div className="form-field">
          <label>Kansion nimi</label>
          <input
            name="name"
            placeholder="Esim. U17 kehitysryhmä — kevät 2026"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Oppilaan nimi (valinnainen)</label>
            <input name="athleteName" placeholder="Esim. Ella Esimerkki" />
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
          <button type="submit">Luo uusi ryhmäkansio</button>
        </div>
      </form>

      {visibleFolders.length === 0 ? (
        <div className="folders-empty">
          {folders.length === 0
            ? "Ei kansioita vielä. Luo ensimmäinen ryhmä yllä olevalla lomakkeella."
            : "Hakuehdoilla ei löytynyt kansioita. Kokeile toista hakua tai roolisuodatinta."}
        </div>
      ) : (
        <div className="folders-list">
          {visibleFolders.map((f) => (
            <Link key={f.id} href={`/app/folders/${f.id}`} className="folder-card">
              <div className="folder-row">
                <div className="folder-name">{f.name}</div>
                <span className={`folder-role folder-role--${roleClass(f.myRole)}`}>
                  {roleLabel(f.myRole)}
                </span>
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
