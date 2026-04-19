import { createClient } from "@supabase/supabase-js";

// External Supabase project for PJN Educare.
// Publishable (anon) key — safe to expose. RLS policies must be configured in Supabase dashboard.
const SUPABASE_URL = "https://tvjdlkbrpjmjjyceqmdl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8s6QAnU5ePngbzMIz__1_g_brJmqFh2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "pjn-educare-auth",
  },
});

// ---------- Types ----------

export type Course = {
  id: string;
  title: string;
  category: "IIT-JEE" | "NEET" | "CUET" | "NDA" | "Govt Jobs";
  description: string | null;
  fees: number;
  duration: string;
  is_active: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  course: string | null;
  message: string | null;
  status: "new" | "contacted" | "interested" | "converted" | "cold";
  created_at: string;
};

export type Result = {
  id: string;
  student_name: string;
  exam: string | null;
  marks: string | null;
  rank: string | null;
  image_url: string | null;
  year: number | null;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  logo_url: string | null;
  updated_at: string;
};
