// app/(product)/app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getHomeDashboardData } from "@/app/actions/home";

import HomeWelcome from "./_components/HomeWelcome";
import QuickActions from "./_components/QuickActions";
import RecentEvaluations from "./_components/RecentEvaluations";
import WeekSummary from "./_components/WeekSummary";
import EmptyState from "./_components/EmptyState";

import "./home.css";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/app");

  const data = await getHomeDashboardData();

  const hasFolders = data.counts.folders > 0;
  const hasEvaluations = data.recentEvaluations.length > 0;

  return (
    <div className="homePage">
      <HomeWelcome
        user={data.user}
        counts={{
          evaluationsThisWeek: data.counts.evaluationsThisWeek,
          unreadNotifications: data.counts.unreadNotifications,
        }}
      />

      <div className="homeGrid">
        <section className="homeCol homeCol--main">
          <QuickActions />
          <RecentEvaluations items={data.recentEvaluations} />
        </section>

        <aside className="homeCol homeCol--side">
          <WeekSummary counts={data.counts} week={data.week} />
        </aside>
      </div>

      <EmptyState hasFolders={hasFolders} hasEvaluations={hasEvaluations} />
    </div>
  );
}
