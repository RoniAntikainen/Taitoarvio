import CalendarClient from "./CalendarClient";
import { listMyCalendarMeetings } from "@/app/actions/meetings";
import "./calendar.css";

export default async function CalendarPage() {
  const meetings = await listMyCalendarMeetings(); // kaikki

  return (
    <div className="calendar-page">
      <div className="calendar-top">
        <div>
          <h1 className="calendar-title">Kalenteri</h1>
          <div className="calendar-subtitle">
            Klikkaa tapahtumaa → muokkaa muistiinpanot. Vedä kalenteriin → uusi tapaaminen.
          </div>
        </div>
      </div>

      <CalendarClient meetings={meetings as any} />
    </div>
  );
}
