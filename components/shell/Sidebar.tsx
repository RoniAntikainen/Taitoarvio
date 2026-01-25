import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="appSidebar" aria-label="Sidebar navigation">
      <nav className="appSidebar__nav">
        <Link href="/app">Home</Link>
        <Link href="/app/search">Search</Link>
        <Link href="/app/settings">Settings</Link>
      </nav>
    </aside>
  );
}
