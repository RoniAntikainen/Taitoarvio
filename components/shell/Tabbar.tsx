import Link from "next/link";

export default function Tabbar() {
  return (
    <nav className="appTabbar" aria-label="Primary navigation">
      <Link className="appTabbar__item" href="/app">Home</Link>
      <Link className="appTabbar__item" href="/app/search">Search</Link>
      <Link className="appTabbar__item" href="/app/settings">Settings</Link>
    </nav>
  );
}
