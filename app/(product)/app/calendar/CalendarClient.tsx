"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  createFolderMeeting,
  updateMeeting,
  deleteMeeting,
} from "@/app/actions/meetings";

type Meeting = {
  id: string;
  folderId: string;
  title: string;
  startsAt: string | Date;
  endsAt: string | Date | null;
  location: string | null;
  agenda: string | null;
  notes: string | null;

  // jos action palauttaa folderin nimen, käytetään sitä.
  folder?: { name?: string | null } | null;
};

type Draft = {
  mode: "create" | "edit";
  id?: string;
  folderId: string;

  title: string;
  startsAt: string; // datetime-local
  endsAt: string;   // datetime-local
  location: string;
  agenda: string;
  notes: string;

  folderName?: string | null;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function toLocalInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function parseDate(x: string | Date) {
  return x instanceof Date ? x : new Date(x);
}

export default function CalendarClient({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const events = useMemo(() => {
    return meetings.map((m) => {
      const folderName = m.folder?.name ?? null;
      const title = folderName ? `${m.title} · ${folderName}` : m.title;

      return {
        id: m.id,
        title,
        start: m.startsAt,
        end: m.endsAt ?? undefined,
        allDay: false,
        extendedProps: {
          folderId: m.folderId,
          folderName,
          location: m.location,
          agenda: m.agenda,
          notes: m.notes,
          rawTitle: m.title,
        },
      };
    });
  }, [meetings]);

  function closeModal() {
    setOpen(false);
    setDraft(null);
  }

  function openCreate(start: Date, end: Date) {
    // FolderId pakollinen backendissä -> default: ensimmäisen meetingin folder tai "unknown"
    // Parempi: jos haluat valita kansio dropdownista, lisätään se myöhemmin.
    const defaultFolderId =
      meetings[0]?.folderId ?? "UNKNOWN_FOLDER_ID";

    setDraft({
      mode: "create",
      folderId: defaultFolderId,
      title: "Tapaaminen",
      startsAt: toLocalInputValue(start),
      endsAt: toLocalInputValue(end),
      location: "",
      agenda: "",
      notes: "",
    });
    setOpen(true);
  }

  function openEdit(meetingId: string, props: any, start: Date, end?: Date) {
    setDraft({
      mode: "edit",
      id: meetingId,
      folderId: props.folderId,
      title: props.rawTitle ?? "Tapaaminen",
      startsAt: toLocalInputValue(start),
      endsAt: end ? toLocalInputValue(end) : "",
      location: props.location ?? "",
      agenda: props.agenda ?? "",
      notes: props.notes ?? "",
      folderName: props.folderName ?? null,
    });
    setOpen(true);
  }

  function onSave() {
    if (!draft) return;

    startTransition(async () => {
      if (draft.mode === "create") {
        const res = await createFolderMeeting(draft.folderId, {
          title: draft.title.trim(),
          startsAt: draft.startsAt,
          endsAt: draft.endsAt || undefined,
          location: draft.location.trim(),
          agenda: draft.agenda.trim(),
          notes: draft.notes.trim(),
        });

        if (!res?.ok) {
          alert(res?.error ?? "Tallennus epäonnistui");
          return;
        }

        closeModal();
        router.refresh();
        return;
      }

      // edit
      const res = await updateMeeting(draft.id!, {
        title: draft.title.trim(),
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        location: draft.location.trim(),
        agenda: draft.agenda.trim(),
        notes: draft.notes.trim(),
      });

      if (!res?.ok) {
        alert(res?.error ?? "Tallennus epäonnistui");
        return;
      }

      closeModal();
      router.refresh();
    });
  }

  function onDelete() {
    if (!draft?.id) return;
    if (!confirm("Poistetaanko tapaaminen?")) return;

    startTransition(async () => {
      const res = await deleteMeeting(draft.id!);
      if (!res?.ok) {
        alert(res?.error ?? "Poisto epäonnistui");
        return;
      }
      closeModal();
      router.refresh();
    });
  }

  return (
    <>
      <div className="calendar-shell">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          height="auto"
          firstDay={1}
          locale="fi"
          selectable
          selectMirror
          nowIndicator
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{ today: "Tänään", month: "Kuukausi", week: "Viikko", day: "Päivä" }}
          events={events as any}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          select={(info) => {
            // vedä hiirellä alue → luo uusi
            openCreate(info.start, info.end);
          }}
          eventClick={(info) => {
            const props: any = info.event.extendedProps;
            openEdit(
              info.event.id,
              props,
              info.event.start!,
              info.event.end ?? undefined
            );
          }}
        />
      </div>

      {open && draft ? (
        <div className="modal-overlay" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">
                  {draft.mode === "create" ? "Uusi tapaaminen" : "Muokkaa tapaamista"}
                </div>
                <div className="modal-sub">
                  {draft.folderName
                    ? `Kansio: ${draft.folderName}`
                    : `Kansio-ID: ${draft.folderId}`}
                </div>
              </div>

              <button className="modal-x" onClick={closeModal} aria-label="Sulje">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label>Otsikko</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Esim. Treenit / Palaveri"
                />
              </div>

              <div className="row">
                <div className="field">
                  <label>Alkaa</label>
                  <input
                    type="datetime-local"
                    value={draft.startsAt}
                    onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Päättyy</label>
                  <input
                    type="datetime-local"
                    value={draft.endsAt}
                    onChange={(e) => setDraft({ ...draft, endsAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Paikka</label>
                <input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  placeholder="Esim. sali / Teams / kenttä"
                />
              </div>

              <div className="field">
                <label>Mitä sovittiin / agenda</label>
                <textarea
                  value={draft.agenda}
                  onChange={(e) => setDraft({ ...draft, agenda: e.target.value })}
                  rows={3}
                  placeholder="- Tavoite&#10;- Tehtävät&#10;- Jatkotoimet"
                />
              </div>

              <div className="field">
                <label>Mitä juteltiin (muistiinpanot)</label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  rows={5}
                  placeholder="Kirjaa keskustelun ydinkohdat, fiilis, havainnot..."
                />
              </div>
            </div>

            <div className="modal-foot">
              {draft.mode === "edit" ? (
                <button className="btn-danger" disabled={pending} onClick={onDelete}>
                  Poista
                </button>
              ) : (
                <div />
              )}

              <div className="modal-actions">
                <button className="btn-ghost" disabled={pending} onClick={closeModal}>
                  Peruuta
                </button>
                <button className="btn-primary" disabled={pending} onClick={onSave}>
                  {pending ? "Tallennetaan..." : "Tallenna"}
                </button>
              </div>
            </div>

            {draft.mode === "edit" ? (
              <div className="modal-hint">
                Vinkki: klikkaa tapahtumaa kalenterissa muokataksesi. Vedä kalenteriin uusi tapaaminen.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
