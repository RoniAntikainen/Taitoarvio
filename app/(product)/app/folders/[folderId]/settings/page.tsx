import Link from "next/link";
import { getFolderView } from "@/app/actions/folders";
import { getFolderProfile, saveFolderProfileFromForm } from "@/app/actions/folder-sections";

export default async function FolderSettingsPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const { folder, role } = await getFolderView(folderId);
  const profile = await getFolderProfile(folderId);

  const canEdit = role !== "viewer";

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 820 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Kansion asetukset</h1>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{folder.name}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href={`/app/folders/${folderId}`}>Takaisin kansioon</Link>
          <Link href="/app/folders">Kaikki kansiot</Link>
        </div>
      </div>

      <section style={{ padding: 12, borderRadius: 16, background: "rgba(0,0,0,.04)", display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Profiili</h2>

        <form action={saveFolderProfileFromForm.bind(null, folderId)} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Oppilaan nimi</label>
            <input
              name="athleteName"
              defaultValue={profile.athleteName}
              disabled={!canEdit}
              style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Laji (vaihdettavissa vain asetuksissa)</label>
            <select name="sportId" defaultValue={profile.sportId} disabled={!canEdit} style={{ padding: 10, borderRadius: 12 }}>
              <option value="football">Jalkapallo</option>
              <option value="dance">Tanssi</option>
            </select>
          </div>

          {canEdit ? (
            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12, width: "fit-content" }}>
              Tallenna
            </button>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.75 }}>Sinulla on vain lukuoikeus.</div>
          )}
        </form>
      </section>
    </div>
  );
}
