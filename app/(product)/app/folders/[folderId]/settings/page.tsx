import Link from "next/link";
import { getFolderView } from "@/app/actions/folders";
import {
  getFolderProfile,
  saveFolderProfileFromForm,
} from "@/app/actions/folder-sections";
import "./folder-settings.css";

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
    <div className="fs-page">
      <div className="fs-header">
        <div>
          <h1 className="fs-title">Kansion asetukset</h1>
          <div className="fs-meta">{folder.name}</div>
        </div>

        <div className="fs-actions">
          <Link href={`/app/folders/${folderId}`}>Takaisin kansioon</Link>
          <Link href="/app/folders">Kaikki kansiot</Link>
        </div>
      </div>

      <section className="fs-card">
        <h2>Profiili</h2>

        <form
          action={saveFolderProfileFromForm.bind(null, folderId)}
          className="fs-form"
        >
          <div className="fs-field">
            <label className="fs-label">Oppilaan nimi</label>
            <input
              name="athleteName"
              defaultValue={profile.athleteName}
              disabled={!canEdit}
              className="input"
            />
          </div>

          <div className="fs-field">
            <label className="fs-label">
              Laji (vaihdettavissa vain asetuksissa)
            </label>
            <select
              name="sportId"
              defaultValue={profile.sportId}
              disabled={!canEdit}
              className="input"
            >
              <option value="football">Jalkapallo</option>
              <option value="dance">Tanssi</option>
            </select>
          </div>

          {canEdit ? (
            <button type="submit" className="btn">
              Tallenna
            </button>
          ) : (
            <div className="fs-muted">Sinulla on vain lukuoikeus.</div>
          )}
        </form>
      </section>
    </div>
  );
}
