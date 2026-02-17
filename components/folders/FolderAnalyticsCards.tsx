// components/folders/FolderAnalyticsCards.tsx
import { getFolderAnalytics } from "@/app/actions/folder-analytics";

export default async function FolderAnalyticsCards({ folderId }: { folderId: string }) {
  const a = await getFolderAnalytics(folderId);

  return (
    <section style={{ marginTop: 14, padding: 14, borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)" }}>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 700 }}>Yhteenveto</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: 0.9 }}>
            <span>Arviointeja: <b>{a.counts.evaluations}</b></span>
            <span>Score-dataa: <b>{a.counts.scores}</b></span>
            <span>Keskiarvo (kaikki): <b>{a.avgAll.toFixed(2)}</b></span>
            <span>7 pv: <b>{a.avg7.toFixed(2)}</b></span>
            <span>30 pv: <b>{a.avg30.toFixed(2)}</b></span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 700 }}>Trend (10 viimeistä)</div>
          <div style={{ display: "grid", gap: 6 }}>
            {a.trend.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ opacity: 0.8 }}>{new Date(t.at).toLocaleDateString("fi-FI")}</span>
                <span style={{ flex: 1, opacity: 0.85, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.subject}
                </span>
                <span><b>{t.value.toFixed(2)}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
