import { auth } from "@/auth";
import AppNav from "@/components/nav/AppNav";
import UserSheet from "@/components/user/UserMenu";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="appShell">
      {/* Tablet topbar */}
      <header className="appTopbar">
        <div className="appTopbar__brand">Taitoarvio</div>
        <nav className="appTopbar__nav">
          <AppNav mode="tablet" />
        </nav>
        <div className="appTopbar__user">
          {session?.user && <UserSheet user={session.user} />}
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="appSidebar">
        <nav className="appSidebar__nav">
          <AppNav mode="desktop" />
        </nav>
        <div className="appSidebar__user">
          {session?.user && <UserSheet user={session.user} />}
        </div>
      </aside>

      <main className="appMain">{children}</main>

      {/* Mobile bottom bar */}
      <nav className="appTabbar">
        <AppNav mode="mobile" />
        {session?.user && <UserSheet user={session.user} />}
      </nav>
    </div>
  );
}
