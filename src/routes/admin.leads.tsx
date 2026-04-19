import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Phone } from "lucide-react";
import { supabase, type Lead } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdmin,
});

const STATUSES: Lead["status"][] = ["new", "contacted", "interested", "converted", "cold"];

function LeadsAdmin() {
  const [items, setItems] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all");

  async function load() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Lead[]);
  }
  useEffect(() => {
    load();
    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Status updated");
  }

  function exportCsv() {
    const rows = [
      ["Name", "Phone", "Course", "Status", "Message", "Date"],
      ...items.map((l) => [
        l.name,
        l.phone,
        l.course || "",
        l.status,
        (l.message || "").replace(/[\n,]/g, " "),
        format(new Date(l.created_at), "yyyy-MM-dd HH:mm"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pjn-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = filter === "all" ? items : items.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} total · Live updates enabled
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="px-4 py-2.5 border border-border rounded-full inline-flex items-center gap-2 text-sm font-semibold hover:bg-secondary"
        >
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest ${
              filter === s
                ? "bg-yellow-accent text-navy-deep"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground bg-secondary/50">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{l.name}</td>
                  <td className="p-4">
                    <a
                      href={`tel:${l.phone}`}
                      className="text-yellow-accent inline-flex items-center gap-1.5"
                    >
                      <Phone className="size-3" /> {l.phone}
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground">{l.course || "—"}</td>
                  <td className="p-4">
                    <select
                      value={l.status}
                      onChange={(e) =>
                        updateStatus(l.id, e.target.value as Lead["status"])
                      }
                      className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs uppercase tracking-widest font-semibold focus:outline-none focus:border-yellow-accent"
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {format(new Date(l.created_at), "MMM d, h:mm a")}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">
                    No leads {filter !== "all" && `with status "${filter}"`} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
