import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, IndianRupee, Loader2 } from "lucide-react";
import { supabase, type Course } from "@/lib/supabase";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — PJN Educare" },
      {
        name: "description",
        content:
          "Explore IIT-JEE, NEET, CUET, NDA and Govt Jobs coaching programs at PJN Educare.",
      },
    ],
  }),
  component: CoursesPage,
});

const categories = ["All", "IIT-JEE", "NEET", "CUET", "NDA", "Govt Jobs"] as const;
type Cat = (typeof categories)[number];

const fallbackCourses: Course[] = [
  { id: "1", title: "IIT-JEE Foundation", category: "IIT-JEE", description: "2-year integrated program for class 11-12 covering Physics, Chemistry, Math.", fees: 125000, duration: "24 months", is_active: true, created_at: "" },
  { id: "2", title: "JEE Crash Course", category: "IIT-JEE", description: "Intensive 4-month sprint covering JEE Main + Advanced syllabus.", fees: 45000, duration: "4 months", is_active: true, created_at: "" },
  { id: "3", title: "NEET Complete", category: "NEET", description: "Comprehensive Biology, Physics, Chemistry preparation for NEET aspirants.", fees: 110000, duration: "24 months", is_active: true, created_at: "" },
  { id: "4", title: "CUET Mastery", category: "CUET", description: "All-domain coverage for Central University Entrance Test 2025.", fees: 35000, duration: "6 months", is_active: true, created_at: "" },
  { id: "5", title: "NDA Foundation", category: "NDA", description: "Written exam + SSB interview preparation for defense aspirants.", fees: 55000, duration: "10 months", is_active: true, created_at: "" },
  { id: "6", title: "SSC CGL Pro", category: "Govt Jobs", description: "Complete preparation for SSC CGL Tier 1, 2 and 3.", fees: 28000, duration: "8 months", is_active: true, created_at: "" },
];

function CoursesPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error || !data || data.length === 0) {
        setCourses(fallbackCourses);
      } else {
        setCourses(data as Course[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return cat === "All" ? courses : courses.filter((c) => c.category === cat);
  }, [courses, cat]);

  return (
    <div className="px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
            Programs
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Find your <span className="italic text-yellow-accent">path</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Curated programs across India's most competitive exams.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                cat === c
                  ? "bg-yellow-accent text-navy-deep"
                  : "bg-secondary text-foreground/70 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-yellow-accent" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                className="glass-card rounded-2xl p-6 flex flex-col"
              >
                <span className="self-start px-3 py-1 rounded-full bg-yellow-accent/10 text-yellow-accent text-[10px] font-bold uppercase tracking-widest">
                  {c.category}
                </span>
                <h3 className="text-xl font-bold mt-4">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">
                  {c.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="size-4 text-yellow-accent" />
                    <span className="font-semibold">
                      {c.fees.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-yellow-accent" />
                    <span className="text-muted-foreground">{c.duration}</span>
                  </div>
                </div>
                <a
                  href="/contact"
                  className="text-center px-5 py-3 bg-yellow-accent text-navy-deep font-bold rounded-full text-sm hover:scale-[1.02] transition-transform"
                >
                  Enroll Now
                </a>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-12">
                No courses in this category yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
