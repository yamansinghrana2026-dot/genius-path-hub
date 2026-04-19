import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, GraduationCap, Sparkles, Trophy } from "lucide-react";
import { Counter } from "@/components/site/Counter";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PJN Educare — India's Leading Coaching Hub" },
      {
        name: "description",
        content:
          "Premium coaching for IIT-JEE, NEET, CUET, NDA & Govt Jobs. 95%+ success rate.",
      },
    ],
  }),
  component: HomePage,
});

const programs = [
  { title: "IIT-JEE", desc: "Engineering entrance mastery", icon: GraduationCap },
  { title: "NEET", desc: "Medical entrance excellence", icon: Sparkles },
  { title: "CUET", desc: "Central university gateway", icon: Award },
  { title: "NDA", desc: "Defense academy preparation", icon: Trophy },
];

const toppers = [
  { name: "Aditya Vardhan", rank: "AIR 1247", exam: "JEE Advanced 2024" },
  { name: "Priya Sharma", rank: "99.4%ile", exam: "NEET 2024" },
  { name: "Rahul Mehta", rank: "99.7%ile", exam: "CUET 2024" },
  { name: "Sneha Kapoor", rank: "Selected", exam: "NDA 2024" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="absolute top-1/3 -left-1/4 size-[500px] bg-navy-brand rounded-full blur-[140px] opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 -right-1/4 size-[400px] bg-yellow-accent rounded-full blur-[160px] opacity-10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 lg:pt-20 pb-20 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6 lg:gap-8"
          >
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-yellow-accent/10 border border-yellow-accent/20 rounded-full w-fit">
              <span className="size-2 rounded-full bg-yellow-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-yellow-accent">
                Admissions Open 2024-25
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-balance">
              India's Leading{" "}
              <span className="text-yellow-accent italic font-semibold">
                Coaching Hub
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-[50ch] leading-relaxed">
              Take the first step towards a bright future. Join a community of
              high-achievers and experience academic breakthrough.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                className="px-8 lg:px-10 py-4 lg:py-5 bg-yellow-accent text-navy-deep font-bold rounded-full hover:scale-105 active:scale-95 transition-transform yellow-glow-shadow inline-flex items-center gap-2"
              >
                Enroll Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="px-8 lg:px-10 py-4 lg:py-5 border border-border font-semibold rounded-full hover:bg-secondary transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-8 lg:mt-12 pt-8 lg:pt-12 border-t border-border">
              <div>
                <div className="text-3xl lg:text-5xl font-bold text-glow">
                  <Counter to={95} suffix="%" />
                </div>
                <div className="text-[10px] lg:text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-5xl font-bold text-glow">
                  <Counter to={1000} suffix="+" />
                </div>
                <div className="text-[10px] lg:text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">
                  Students
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-5xl font-bold text-glow">
                  <Counter to={20} suffix="+" />
                </div>
                <div className="text-[10px] lg:text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">
                  Expert Faculty
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl glass-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-brand via-transparent to-yellow-accent/10" />

              <div className="absolute top-6 right-6 left-6 flex justify-between items-start">
                <div className="flex flex-col gap-1.5 items-start">
                  <div className="h-1 w-16 bg-yellow-accent/40 rounded-full" />
                  <div className="h-1 w-10 bg-yellow-accent/20 rounded-full" />
                  <div className="h-1 w-20 bg-yellow-accent/60 rounded-full" />
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-yellow-accent/70">
                  PJN_24-25
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="size-72 lg:size-80 rounded-full border border-yellow-accent/20 relative"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-3 rounded-full bg-yellow-accent yellow-glow-shadow" />
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 size-2 rounded-full bg-yellow-accent/60" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-yellow-accent/40" />
                </motion.div>
                <div className="absolute text-center">
                  <div className="text-7xl lg:text-8xl font-bold text-glow">95%</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                    Success Rate
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                <div className="p-4 glass-card rounded-2xl flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-navy-brand border border-border flex items-center justify-center font-bold text-yellow-accent text-xs">
                    AIR 1247
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      Aditya Vardhan
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      JEE Advanced 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
                What we teach
              </p>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Programs built for breakthroughs
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-accent hover:gap-3 transition-all"
            >
              Explore all courses <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative glass-card rounded-2xl p-6 lg:p-8 hover:border-yellow-accent/40 transition-colors cursor-pointer"
              >
                <p.icon className="size-8 text-yellow-accent mb-6" />
                <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
                <ArrowRight className="size-5 mt-6 text-foreground/40 group-hover:text-yellow-accent group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP RESULTS */}
      <section className="py-20 lg:py-32 px-6 lg:px-8 bg-card/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
              Top Results Every Year
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Excellence isn't an accident
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toppers.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="mx-auto size-20 rounded-full bg-yellow-accent text-navy-deep font-bold text-2xl flex items-center justify-center mb-4">
                  {t.name[0]}
                </div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-yellow-accent font-bold mt-1">{t.rank}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.exam}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative glass-card rounded-3xl p-8 lg:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-accent/10 via-transparent to-yellow-accent/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
              Ready to begin?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Talk to our admissions team. Discover the program that fits your
              ambition.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-10 py-5 bg-yellow-accent text-navy-deep font-bold rounded-full hover:scale-105 transition-transform yellow-glow-shadow inline-flex items-center gap-2"
              >
                Enroll Now <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="px-10 py-5 border border-border font-semibold rounded-full hover:bg-secondary"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
