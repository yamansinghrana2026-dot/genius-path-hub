import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { supabase, type Course } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses")({
  component: CoursesAdmin,
});

const CATS = ["IIT-JEE", "NEET", "CUET", "NDA", "Govt Jobs"] as const;

function CoursesAdmin() {
  const [items, setItems] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Partial<Course> | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Course[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      title: editing.title,
      category: editing.category,
      description: editing.description,
      fees: Number(editing.fees) || 0,
      duration: editing.duration,
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("courses").update(payload).eq("id", editing.id)
      : await supabase.from("courses").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Course updated" : "Course created");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1">{items.length} total</p>
        </div>
        <button
          onClick={() =>
            setEditing({
              title: "",
              category: "IIT-JEE",
              description: "",
              fees: 0,
              duration: "",
              is_active: true,
            })
          }
          className="px-4 py-2.5 bg-yellow-accent text-navy-deep font-semibold rounded-full inline-flex items-center gap-2 text-sm"
        >
          <Plus className="size-4" /> Add Course
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground bg-secondary/50">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Fees</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{c.title}</td>
                  <td className="p-4 text-yellow-accent">{c.category}</td>
                  <td className="p-4">₹{c.fees.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-muted-foreground">{c.duration}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.is_active
                          ? "bg-yellow-accent/10 text-yellow-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {c.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button
                      onClick={() => setEditing(c)}
                      className="p-2 hover:text-yellow-accent"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      className="p-2 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    No courses yet. Click "Add Course" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-2xl font-bold mb-6">
            {editing.id ? "Edit Course" : "New Course"}
          </h2>
          <div className="grid gap-4">
            <Input
              label="Title"
              value={editing.title || ""}
              onChange={(v) => setEditing({ ...editing, title: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Category
                </span>
                <select
                  value={editing.category || "IIT-JEE"}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value as Course["category"] })
                  }
                  className="px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-yellow-accent"
                >
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <Input
                label="Duration"
                value={editing.duration || ""}
                onChange={(v) => setEditing({ ...editing, duration: v })}
                placeholder="e.g. 6 months"
              />
            </div>
            <Input
              label="Fees (₹)"
              type="number"
              value={String(editing.fees ?? "")}
              onChange={(v) => setEditing({ ...editing, fees: Number(v) })}
            />
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Description
              </span>
              <textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className="px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-yellow-accent resize-none"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editing.is_active ?? true}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                className="size-4 accent-yellow-accent"
              />
              <span className="text-sm">Visible on public site</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="px-6 py-2.5 bg-yellow-accent text-navy-deep font-semibold rounded-full text-sm"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-3xl p-6 lg:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto bg-card relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:text-yellow-accent"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-yellow-accent"
      />
    </label>
  );
}
