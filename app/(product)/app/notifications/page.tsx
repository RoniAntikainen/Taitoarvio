import Link from "next/link";
import { listNotifications } from "@/app/actions/folders";

export default async function NotificationsPage() {
  const items = await listNotifications();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>Ilmoitukset</h1>

      {items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>Ei ilmoituksia.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map(n => (
            <div key={n.id} style={{ padding: 12, borderRadius: 16, background: "rgba(0,0,0,.04)" }}>
              <div style={{ fontWeight: 700 }}>{n.title}</div>
              {n.body ? <div style={{ opacity: 0.8 }}>{n.body}</div> : null}
              {n.href ? <Link href={n.href}>Avaa</Link> : null}
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                {new Date(n.createdAt).toLocaleString("fi-FI")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
