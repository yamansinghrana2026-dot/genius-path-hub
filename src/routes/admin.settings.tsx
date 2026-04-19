import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase, type SiteSettings } from "@/lib/supabase";
import { toast } from "sonner";
import { Input } from "./admin.courses";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [s, setS] = useState<Partial<SiteSettings> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      setS(data || {
        phone: "",
        whatsapp: "",
        email: "",
        hero_heading: "India's Leading Coaching Hub",
        hero_subheading: "Take the First Step Towards a Bright Future",
        logo_url: "",
      });
    })();
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    const payload = {
      phone: s.phone,
      whatsapp: s.whatsapp,
      email: s.email,
      hero_heading: s.hero_heading,
      hero_subheading: s.hero_subheading,
      logo_url: s.logo_url,
    };
    const { error } = s.id
      ? await supabase.from("settings").update(payload).eq("id", s.id)
      : await supabase.from("settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  if (!s) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-yellow-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure site-wide contact info and homepage content.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-5">
        <h2 className="font-semibold text-yellow-accent uppercase tracking-widest text-xs">
          Contact
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={s.phone || ""}
            onChange={(v) => setS({ ...s, phone: v })}
            placeholder="+91 99999 99999"
          />
          <Input
            label="WhatsApp"
            value={s.whatsapp || ""}
            onChange={(v) => setS({ ...s, whatsapp: v })}
            placeholder="+91 99999 99999"
          />
        </div>
        <Input
          label="Email"
          value={s.email || ""}
          onChange={(v) => setS({ ...s, email: v })}
          placeholder="info@pjneducare.com"
        />
      </div>

      <div className="glass-card rounded-2xl p-6 lg:p-8 space-y-5">
        <h2 className="font-semibold text-yellow-accent uppercase tracking-widest text-xs">
          Homepage Content
        </h2>
        <Input
          label="Hero Heading"
          value={s.hero_heading || ""}
          onChange={(v) => setS({ ...s, hero_heading: v })}
        />
        <Input
          label="Hero Subheading"
          value={s.hero_subheading || ""}
          onChange={(v) => setS({ ...s, hero_subheading: v })}
        />
        <Input
          label="Logo URL"
          value={s.logo_url || ""}
          onChange={(v) => setS({ ...s, logo_url: v })}
          placeholder="https://..."
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-8 py-3.5 bg-yellow-accent text-navy-deep font-bold rounded-full inline-flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
      </button>
    </div>
  );
}
