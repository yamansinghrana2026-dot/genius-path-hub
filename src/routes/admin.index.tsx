import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, IndianRupee, Trophy, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

type Stats = {
  totalLeads: number;
  newLeads: number;
  totalCourses: number;
  totalResults: number;
  revenue: number;
  byMonth: { month: string; leads: number }[];
  byCourse: { course: string; count: number }[];
};

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);

      const [leads, newLeads, courses, results, converted] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", since.toISOString()),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("results").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("course").eq("status", "converted"),
      ]);

      const allCourses = await supabase.from("courses").select("title, fees");
      const courseFees = new Map(
        (allCourses.data || []).map((c) => [c.title as string, c.fees as number])
      );
      const revenue = (converted.data || []).reduce(
        (sum, r) => sum + (courseFees.get(r.course as string) || 0),
        0
      );

      // Last 6 months
      const monthly = await supabase
        .from("leads")
        .select("created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString()
        );
      const monthMap = new Map<string, number>();
      (monthly.data || []).forEach((r) => {
        const d = new Date(r.created_at as string);
        const k = d.toLocaleString("en", { month: "short" });
        monthMap.set(k, (monthMap.get(k) || 0) + 1);
      });
      const byMonth = Array.from(monthMap, ([month, leadsCount]) => ({
        month,
        leads: leadsCount,
      }));

      // By course
      const allLeads = await supabase.from("leads").select("course");
      const cmap = new Map<string, number>();
      (allLeads.data || []).forEach((r) => {
        if (r.course) cmap.set(r.course as string, (cmap.get(r.course as string) || 0) + 1);
      });
      const byCourse = Array.from(cmap, ([course, count]) => ({ course, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalLeads: leads.count || 0,
        newLeads: newLeads.count || 0,
        totalCourses: courses.count || 0,
        totalResults: results.count || 0,
        revenue,
        byMonth: byMonth.length ? byMonth : [{ month: "—", leads: 0 }],
        byCourse: byCourse.length ? byCourse : [{ course: "No data yet", count: 0 }],
      });
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your coaching business.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats?.totalLeads ?? "—"}
          sub={`${stats?.newLeads ?? 0} this week`}
        />
        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value={stats?.totalCourses ?? "—"}
        />
        <StatCard
          icon={Trophy}
          label="Results Posted"
          value={stats?.totalResults ?? "—"}
        />
        <StatCard
          icon={IndianRupee}
          label="Revenue (Converted)"
          value={
            typeof stats?.revenue === "number"
              ? `₹${stats.revenue.toLocaleString("en-IN")}`
              : "—"
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Leads over time</h3>
          <p className="text-xs text-muted-foreground mb-6">Last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={stats?.byMonth || []}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 260)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.05 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="oklch(0.85 0.17 90)"
                  strokeWidth={3}
                  dot={{ fill: "oklch(0.85 0.17 90)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Top course interest</h3>
          <p className="text-xs text-muted-foreground mb-6">By lead count</p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={stats?.byCourse || []}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="course" stroke="oklch(0.7 0.02 260)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.02 260)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.05 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="count" fill="oklch(0.85 0.17 90)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="size-10 rounded-lg bg-yellow-accent/10 flex items-center justify-center">
          <Icon className="size-5 text-yellow-accent" />
        </div>
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold">
        {label}
      </div>
      {sub && <div className="text-xs text-yellow-accent mt-2">{sub}</div>}
    </div>
  );
}
