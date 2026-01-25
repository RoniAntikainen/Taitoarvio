import Link from "next/link";

export default function Topbar() {
  return (
    <header className="appTopbar" aria-label="Tablet top bar">
      <div className="appTopbar__brand">Taitoarvio</div>

      <nav className="appTopbar__nav">
        <Link href="/app">Home</Link>
        <Link href="/app/search">Search</Link>
        <Link href="/app/settings">Settings</Link>
      </nav>

      <div className="appTopbar__user">User</div>
    </header>
  );
}
