import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branches — PJN Educare" },
      {
        name: "description",
        content:
          "Visit PJN Educare branches in Najafgarh, Dwarka, and Chhawla. Find your nearest coaching center.",
      },
    ],
  }),
  component: BranchesPage,
});

const branches = [
  {
    name: "Najafgarh",
    address: "Main Najafgarh Road, near Metro Station, New Delhi 110043",
    phone: "+91 99999 11111",
    map: "https://www.google.com/maps?q=Najafgarh+Delhi&output=embed",
  },
  {
    name: "Dwarka",
    address: "Sector 12, Dwarka, opposite Metro Station, New Delhi 110078",
    phone: "+91 99999 22222",
    map: "https://www.google.com/maps?q=Dwarka+Sector+12+Delhi&output=embed",
  },
  {
    name: "Chhawla",
    address: "Main Market Road, Chhawla, New Delhi 110071",
    phone: "+91 99999 33333",
    map: "https://www.google.com/maps?q=Chhawla+Delhi&output=embed",
  },
];

function BranchesPage() {
  return (
    <div className="px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
            Find us
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Three branches.{" "}
            <span className="italic text-yellow-accent">One mission.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {branches.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-secondary relative">
                <iframe
                  title={`${b.name} map`}
                  src={b.map}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold">{b.name}</h3>
                <div className="flex items-start gap-2 mt-4 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-yellow-accent mt-0.5 flex-shrink-0" />
                  <span>{b.address}</span>
                </div>
                <a
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 mt-3 text-sm font-semibold hover:text-yellow-accent"
                >
                  <Phone className="size-4 text-yellow-accent" />
                  {b.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(b.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 text-center px-5 py-3 bg-yellow-accent text-navy-deep font-bold rounded-full text-sm hover:scale-[1.02] transition-transform"
                >
                  Get Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
