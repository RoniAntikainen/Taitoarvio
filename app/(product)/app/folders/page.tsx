import Link from "next/link";
import { createFolder, listMyFolders } from "@/app/actions/folders";

export default async function FoldersPage() {
  const folders = await listMyFolders();

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Kansiot</h1>
        <Link href="/app">Takaisin</Link>
      </div>

      <form
        action={async (formData: FormData) => {
          "use server";
          const name = String(formData.get("name") ?? "").trim();
          const sportId = String(formData.get("sportId") ?? "football") as "football" | "dance";
          const athleteName = String(formData.get("athleteName") ?? "").trim();
          if (!name) return;
          await createFolder(name, sportId, athleteName);
        }}
        style={{
          display: "grid",
          gap: 10,
          padding: 12,
          borderRadius: 16,
          background: "rgba(0,0,0,.04)",
          maxWidth: 720,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.75 }}>Kansion nimi</label>
          <input
            name="name"
            placeholder="Esim. Pakka – 2026"
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Oppilaan nimi</label>
            <input
              name="athleteName"
              placeholder="Esim. Pakka"
              style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.75 }}>Laji</label>
            <select name="sportId" defaultValue="football" style={{ padding: 10, borderRadius: 12 }}>
              <option value="football">Jalkapallo</option>
              <option value="dance">Tanssi</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit" style={{ padding: "10px 12px", borderRadius: 12 }}>
            Luo kansio
          </button>
        </div>
      </form>

      {folders.length === 0 ? (
        <div style={{ opacity: 0.75 }}>Ei kansioita vielä.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {folders.map((f) => (
            <Link
              key={f.id}
              href={`/app/folders/${f.id}`}
              style={{
                display: "block",
                padding: 12,
                borderRadius: 16,
                background: "rgba(0,0,0,.04)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontWeight: 800 }}>{f.name}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Omistaja: {f.ownerId} · Jäseniä: {f.members?.length ?? 0}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
