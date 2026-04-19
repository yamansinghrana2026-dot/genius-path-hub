import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, Upload } from "lucide-react";
import { supabase, type Result } from "@/lib/supabase";
import { toast } from "sonner";
import { Modal, Input } from "./admin.courses";

export const Route = createFileRoute("/admin/results")({
  component: ResultsAdmin,
});

function ResultsAdmin() {
  const [items, setItems] = useState<Result[]>([]);
  const [editing, setEditing] = useState<Partial<Result> | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Result[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("results").upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return null;
    }
    const { data } = supabase.storage.from("results").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  }

  async function save() {
    if (!editing) return;
    const payload = {
      student_name: editing.student_name,
      exam: editing.exam,
      marks: editing.marks,
      rank: editing.rank,
      image_url: editing.image_url,
      year: editing.year,
    };
    const { error } = editing.id
      ? await supabase.from("results").update(payload).eq("id", editing.id)
      : await supabase.from("results").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this result?")) return;
    const { error } = await supabase.from("results").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground mt-1">{items.length} student results</p>
        </div>
        <button
          onClick={() =>
            setEditing({
              student_name: "",
              exam: "",
              marks: "",
              rank: "",
              year: new Date().getFullYear(),
            })
          }
          className="px-4 py-2.5 bg-yellow-accent text-navy-deep font-semibold rounded-full inline-flex items-center gap-2 text-sm"
        >
          <Plus className="size-4" /> Add Result
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((r) => (
          <div key={r.id} className="glass-card rounded-2xl overflow-hidden">
            <div className="aspect-square bg-secondary relative">
              {r.image_url ? (
                <img
                  src={r.image_url}
                  alt={r.student_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-yellow-accent">
                  {r.student_name[0]}
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setEditing(r)}
                  className="p-2 bg-background/80 rounded-full hover:text-yellow-accent"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="p-2 bg-background/80 rounded-full hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold">{r.student_name}</div>
              <div className="text-yellow-accent text-sm font-semibold">
                {r.rank} {r.marks && `· ${r.marks}`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {r.exam} {r.year && `· ${r.year}`}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-16">
            No results yet.
          </p>
        )}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-2xl font-bold mb-6">
            {editing.id ? "Edit Result" : "New Result"}
          </h2>
          <div className="grid gap-4">
            <Input
              label="Student Name"
              value={editing.student_name || ""}
              onChange={(v) => setEditing({ ...editing, student_name: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Exam"
                value={editing.exam || ""}
                onChange={(v) => setEditing({ ...editing, exam: v })}
                placeholder="JEE Advanced"
              />
              <Input
                label="Year"
                type="number"
                value={String(editing.year || "")}
                onChange={(v) => setEditing({ ...editing, year: Number(v) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Rank"
                value={editing.rank || ""}
                onChange={(v) => setEditing({ ...editing, rank: v })}
                placeholder="AIR 247"
              />
              <Input
                label="Marks"
                value={editing.marks || ""}
                onChange={(v) => setEditing({ ...editing, marks: v })}
                placeholder="298/300"
              />
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Photo
              </span>
              <div className="flex items-center gap-3">
                {editing.image_url && (
                  <img
                    src={editing.image_url}
                    alt=""
                    className="size-16 rounded-lg object-cover"
                  />
                )}
                <label className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl cursor-pointer hover:border-yellow-accent flex items-center gap-2 text-sm">
                  <Upload className="size-4" />
                  <span>{uploading ? "Uploading..." : "Upload photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadImage(file);
                      if (url) setEditing({ ...editing, image_url: url });
                    }}
                  />
                </label>
              </div>
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
