import { redirect } from "next/navigation";
import {
  createFolderMeeting,
  deleteMeeting,
  listFolderMeetings,
  updateMeeting,
} from "@/app/actions/meetings";

function toDTLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default async function MeetingsSection({
  folderId,
  role,
  error,
}: {
  folderId: string;
  role: "owner" | "editor" | "viewer";
  error?: string;
}) {
  const meetings = await listFolderMeetings(folderId);
  const canEdit = role === "owner" || role === "editor";

  return (
    <div className="meetings-section">
      {canEdit ? (
        <form
          className="meetings-form"
          action={async (formData: FormData) => {
            "use server";
            const title = String(formData.get("title") ?? "").trim();
            const startsAt = String(formData.get("startsAt") ?? "").trim();
            const endsAt = String(formData.get("endsAt") ?? "").trim();
            const location = String(formData.get("location") ?? "").trim();
            const agenda = String(formData.get("agenda") ?? "").trim();
            const notes = String(formData.get("notes") ?? "").trim();

            const res = await createFolderMeeting(folderId, {
              title,
              startsAt,
              endsAt: endsAt || undefined,
              location,
              agenda,
              notes,
            });

            if (!res.ok) {
              redirect(
                `/app/folders/${folderId}?error=${encodeURIComponent(res.error)}`
              );
            }
            redirect(`/app/folders/${folderId}`);
          }}
        >
          {error ? <div className="meetings-error">{error}</div> : null}

          <div className="form-field">
            <label>Otsikko</label>
            <input
              name="title"
              placeholder="Esim. Treenit / Valmennus / Palaveri"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Alkaa</label>
              <input name="startsAt" type="datetime-local" required />
            </div>
            <div className="form-field">
              <label>Päättyy (valinnainen)</label>
              <input name="endsAt" type="datetime-local" />
            </div>
          </div>

          <div className="form-field">
            <label>Paikka (valinnainen)</label>
            <input name="location" placeholder="Esim. sali / Teams / kenttä" />
          </div>

          <div className="form-field">
            <label>Mitä käydään läpi</label>
            <textarea
              name="agenda"
              rows={3}
              placeholder="- Lämmittely&#10;- Tekniikka&#10;- Tavoitteet"
            />
          </div>

          <div className="form-field">
            <label>Mitä juteltiin + muistiinpanot</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Kirjaa tärkeimmät jutut, fiilikset ja jatkotoimet 💛"
            />
          </div>

          <div>
            <button type="submit">Lisää tapaaminen</button>
          </div>
        </form>
      ) : null}

      {meetings.length === 0 ? (
        <div className="meetings-empty">Ei tapaamisia vielä.</div>
      ) : (
        <div className="meetings-list">
          {meetings.map((m) => (
            <details key={m.id} className="meeting-card">
              <summary className="meeting-card__summary">
                <div className="meeting-card__title">{m.title}</div>
                <div className="meeting-card__meta">
                  {new Date(m.startsAt).toLocaleString("fi-FI")}
                  {m.endsAt
                    ? ` – ${new Date(m.endsAt).toLocaleTimeString("fi-FI", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                  {m.location ? ` · ${m.location}` : ""}
                </div>
              </summary>

              <div className="meeting-card__body">
                <div className="meeting-block">
                  <div className="meeting-block__label">Agenda</div>
                  <div className="meeting-block__text">{m.agenda || "—"}</div>
                </div>

                <div className="meeting-block">
                  <div className="meeting-block__label">Muistiinpanot</div>
                  <div className="meeting-block__text">{m.notes || "—"}</div>
                </div>

                {canEdit ? (
                  <div className="meeting-editWrap">
                    <form
                      className="meeting-edit"
                      action={async (formData: FormData) => {
                        "use server";
                        const title = String(formData.get("title") ?? "").trim();
                        const startsAt = String(
                          formData.get("startsAt") ?? ""
                        ).trim();
                        const endsAt = String(
                          formData.get("endsAt") ?? ""
                        ).trim();
                        const location = String(
                          formData.get("location") ?? ""
                        ).trim();
                        const agenda = String(
                          formData.get("agenda") ?? ""
                        ).trim();
                        const notes = String(formData.get("notes") ?? "").trim();

                        const res = await updateMeeting(m.id, {
                          title,
                          startsAt,
                          endsAt,
                          location,
                          agenda,
                          notes,
                        });

                        if (!res.ok) {
                          redirect(
                            `/app/folders/${folderId}?error=${encodeURIComponent(
                              res.error
                            )}`
                          );
                        }
                        redirect(`/app/folders/${folderId}`);
                      }}
                    >
                      <div className="form-field">
                        <label>Otsikko</label>
                        <input name="title" defaultValue={m.title} required />
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <label>Alkaa</label>
                          <input
                            name="startsAt"
                            type="datetime-local"
                            defaultValue={toDTLocalValue(new Date(m.startsAt))}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label>Päättyy</label>
                          <input
                            name="endsAt"
                            type="datetime-local"
                            defaultValue={
                              m.endsAt ? toDTLocalValue(new Date(m.endsAt)) : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Paikka</label>
                        <input
                          name="location"
                          defaultValue={m.location ?? ""}
                        />
                      </div>

                      <div className="form-field">
                        <label>Agenda</label>
                        <textarea
                          name="agenda"
                          rows={3}
                          defaultValue={m.agenda ?? ""}
                        />
                      </div>

                      <div className="form-field">
                        <label>Muistiinpanot</label>
                        <textarea
                          name="notes"
                          rows={4}
                          defaultValue={m.notes ?? ""}
                        />
                      </div>

                      <div className="meeting-actions">
                        <button type="submit">Tallenna</button>
                      </div>
                    </form>

                    {/* EI SISÄKKÄISTÄ FORMIA: delete on oma form */}
                    <form
                      className="meeting-delete"
                      action={async () => {
                        "use server";
                        const res = await deleteMeeting(m.id);
                        if (!res.ok) {
                          redirect(
                            `/app/folders/${folderId}?error=${encodeURIComponent(
                              res.error
                            )}`
                          );
                        }
                        redirect(`/app/folders/${folderId}`);
                      }}
                    >
                      <button type="submit">Poista</button>
                    </form>
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
