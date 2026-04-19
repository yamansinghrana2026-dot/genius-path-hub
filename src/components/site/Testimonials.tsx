import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aditya Vardhan",
    achievement: "JEE Advanced — AIR 1247",
    quote:
      "The faculty's depth and the daily practice routine at PJN transformed my preparation. Every concept clicked the way it should.",
  },
  {
    name: "Priya Sharma",
    achievement: "NEET — 99.4 percentile",
    quote:
      "From mock tests to one-on-one mentorship — PJN gave me a system. I never felt alone in my preparation journey.",
  },
  {
    name: "Rahul Mehta",
    achievement: "CUET — 99.7 percentile",
    quote:
      "Top-tier mentors, ruthless test series, and a culture of excellence. PJN is the real deal for serious aspirants.",
  },
  {
    name: "Sneha Kapoor",
    achievement: "NDA — Final selection",
    quote:
      "The discipline and structure here matched the rigor of NDA itself. My selection is a direct result of PJN.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[i];

  return (
    <section className="relative py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
            Voices of Success
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Built on real results
          </h2>
        </div>

        <div className="relative glass-card rounded-3xl p-8 lg:p-16 min-h-[280px]">
          <Quote className="absolute top-8 right-8 size-12 text-yellow-accent/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-xl lg:text-2xl leading-relaxed font-light text-foreground/90">
                "{t.quote}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="size-12 rounded-full bg-yellow-accent text-navy-deep font-bold flex items-center justify-center">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-yellow-accent">{t.achievement}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-8 bg-yellow-accent" : "w-1.5 bg-foreground/20"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
