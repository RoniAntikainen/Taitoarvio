import Link from "next/link";
import {
  addMemberFromForm,
  getFolderView,
  leaveFolder,
  listFolderEvaluations,
  removeMember,
} from "@/app/actions/folders";
import {
  getFolderProfile,
  getSection,
  saveResultsJsonFromForm,
  saveSectionFromForm,
  saveUpcomingJsonFromForm,
} from "@/app/actions/folder-sections";
import { createFolderEvaluationFromForm } from "@/app/actions/folder-evaluations";
import ResultsEditor from "@/components/folders/ResultsEditor";
import UpcomingPicker from "@/components/folders/UpcomingPicker";

function sportName(sportId: string) {
  if (sportId === "dance") return "Tanssi";
  return "Jalkapallo";
}

function areasForSport(sportId: string) {
  if (sportId === "dance") return ["Tekniikka", "Rytmi", "Esiintyminen", "Pari-/ryhmätyö", "Kestävyys"];
  return ["Joukkuepelaaminen", "Tekniikka", "Peliasenne", "Taktinen ymmärrys", "Fyysisyys"];
}

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  const { folder, role } = await getFolderView(folderId);
  const profile = await getFolderProfile(folderId);
  const sportId = profile.sportId;

  const plan = await getSection(folderId, "plan");
  const upcoming = await getSection(folderId, "upcoming");
  const results = await getSection(folderId, "results");

  const evaluations = await listFolderEvaluations(folderId);
  const canEdit = role !== "viewer";

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{folder.name}</h1>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Oppilas: {profile.athleteName || "—"} · Laji: {sportName(sportId)} · Rooli: {role}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/app/folders">Takaisin</Link>
          <Link href={`/app/folders/${folderId}/settings`}>Asetukset</Link>
          {role !== "owner" ? (
            <form action={leaveFolder.bind(null, folderId)}>
              <button type="submit" style={{ padding: "8px 10px", borderRadius: 12 }}>
                Poistu
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <section style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={{ padding: "10px 12px", borderRadius: 12 }} disabled>
          + Uusi muistiinpano
        </button>
        <button type="button" style={{ padding: "10px 12px", borderRadius: 12 }} disabled>
          + Lisää tulos
        </button>
        <button type="button" style={{ padding: "10px 12px", borderRadius: 12 }} disabled>
          + Tee arviointi
        </button>
        <button type="button" style={{ padding: "10px 12px", borderRadius: 12 }} disabled>
          Jaa
        </button>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Valmennussuunnitelma</h2>
        <form action={saveSectionFromForm.bind(null, folderId, "plan")} style={{ display: "grid", gap: 8 }}>
          <textarea
            name="content"
            rows={8}
            defaultValue={plan.content}
            placeholder="Kirjoita valmennussuunnitelma tähän..."
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            disabled={!canEdit}
          />
          <input type="hidden" name="title" value="Valmennussuunnitelma" />
          {canEdit ? (
            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12, width: "fit-content" }}>
              Tallenna
            </button>
          ) : null}
        </form>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Tulevat kilpailut / pelit</h2>

        <form action={saveUpcomingJsonFromForm.bind(null, folderId)} style={{ display: "grid", gap: 10 }}>
          <UpcomingPicker sportId={sportId} initialJson={upcoming.content || ""} readOnly={!canEdit} />

          {canEdit ? (
            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12, width: "fit-content" }}>
              Tallenna tulevat
            </button>
          ) : null}
        </form>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Tulokset</h2>
        <form action={saveResultsJsonFromForm.bind(null, folderId)} style={{ display: "grid", gap: 10 }}>
          <ResultsEditor sportId={sportId as any} initialJson={results.content || "[]"} readOnly={!canEdit} />
          {canEdit ? (
            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12, width: "fit-content" }}>
              Tallenna tulokset
            </button>
          ) : null}
        </form>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Oppilaan arviointi (1–5, “—” = arvioimaton)</h2>

        {canEdit ? (
          <form
            action={createFolderEvaluationFromForm.bind(null, folderId)}
            style={{ display: "grid", gap: 10, padding: 12, borderRadius: 16, background: "rgba(0,0,0,.04)" }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                name="subject"
                defaultValue={profile.athleteName || "Oppilas"}
                placeholder="Oppilaan nimi"
                style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)", minWidth: 220 }}
              />
              <input
                name="evaluator"
                placeholder="Arvioija (valinnainen)"
                style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)", minWidth: 220 }}
              />
              <input type="hidden" name="sportId" value={sportId} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {areasForSport(sportId).map((a) => (
                <div key={a} style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 10, alignItems: "center" }}>
                  <div style={{ fontWeight: 700 }}>{a}</div>
                  <select
                    name={`score:${a}`}
                    defaultValue="unrated"
                    style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
                  >
                    <option value="unrated">—</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              ))}
            </div>

            <textarea
              name="notes"
              rows={4}
              placeholder="Lisähuomiot"
              style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />

            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12, width: "fit-content" }}>
              Tallenna arviointi
            </button>
          </form>
        ) : (
          <div style={{ fontSize: 12, opacity: 0.75 }}>Sinulla on vain lukuoikeus.</div>
        )}

        {evaluations.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Ei arviointeja vielä.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {evaluations.map((e: any) => (
              <div key={e.id} style={{ padding: 12, borderRadius: 16, background: "rgba(0,0,0,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 800 }}>{e.subject}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{new Date(e.createdAt).toLocaleString("fi-FI")}</div>
                </div>

                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                  {e.sportLabel} · {e.evaluator}
                </div>

                {e.data?.scores ? (
                  <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                    {Object.entries(e.data.scores).map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div>{k}</div>
                        <div style={{ fontWeight: 800 }}>{String(v)}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {e.data?.notes ? <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{e.data.notes}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      {role === "owner" ? (
        <section style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0 }}>Jaa kansio</h2>

          <form action={addMemberFromForm.bind(null, folderId)} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              name="email"
              placeholder="käyttäjä@domain.com"
              style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />
            <select name="role" defaultValue="viewer" style={{ padding: 10, borderRadius: 12 }}>
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
            </select>
            <button type="submit" style={{ padding: "10px 12px", borderRadius: 12 }}>
              Lisää
            </button>
          </form>

          {"members" in folder && Array.isArray((folder as any).members) ? (
            <div style={{ display: "grid", gap: 8 }}>
              {(folder as any).members.map((m: any) => (
                <div
                  key={m.userEmail}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.userEmail}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      rooli: {m.role} · lisätty: {new Date(m.createdAt).toLocaleString("fi-FI")}
                    </div>
                  </div>

                  {m.userEmail !== folder.ownerId ? (
                    <form action={removeMember.bind(null, folderId, m.userEmail)}>
                      <button type="submit" style={{ padding: "8px 10px", borderRadius: 12 }}>
                        Poista
                      </button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
