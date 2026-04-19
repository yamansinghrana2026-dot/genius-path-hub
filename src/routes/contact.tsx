import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, MessageCircle, Phone, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PJN Educare" },
      {
        name: "description",
        content:
          "Get in touch with PJN Educare. Enroll today or talk to our admissions team.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s-]{10,15}$/, "Enter a valid phone number"),
  course: z.string().trim().min(1, "Please select a course").max(50),
  message: z.string().trim().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    const { error } = await supabase.from("leads").insert({
      name: values.name,
      phone: values.phone,
      course: values.course,
      message: values.message || null,
      status: "new",
    });
    if (error) {
      console.error(error);
      toast.error(
        "Could not save your enquiry. Please call us or try again shortly."
      );
      return;
    }
    setDone(true);
    toast.success("Enquiry received! We'll be in touch within 24 hours.");
  }

  return (
    <div className="px-6 lg:px-8 py-16 lg:py-24">
      <Toaster position="top-center" theme="dark" />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-accent mb-4">
              Get in touch
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Let's talk about your{" "}
              <span className="italic text-yellow-accent">future.</span>
            </h1>
            <p className="text-muted-foreground mt-4">
              Drop your details and our admissions team will reach out within 24
              hours.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="tel:+919999999999"
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-accent/40 transition-colors"
            >
              <div className="size-10 rounded-full bg-yellow-accent/10 flex items-center justify-center">
                <Phone className="size-5 text-yellow-accent" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Call
                </div>
                <div className="font-semibold">+91 99999 99999</div>
              </div>
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-accent/40 transition-colors"
            >
              <div className="size-10 rounded-full bg-yellow-accent/10 flex items-center justify-center">
                <MessageCircle className="size-5 text-yellow-accent" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  WhatsApp
                </div>
                <div className="font-semibold">Chat with admissions</div>
              </div>
            </a>
            <a
              href="mailto:info@pjneducare.com"
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-accent/40 transition-colors"
            >
              <div className="size-10 rounded-full bg-yellow-accent/10 flex items-center justify-center">
                <Mail className="size-5 text-yellow-accent" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </div>
                <div className="font-semibold">info@pjneducare.com</div>
              </div>
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 glass-card rounded-3xl p-6 lg:p-10"
        >
          {done ? (
            <div className="flex flex-col items-center text-center py-12">
              <CheckCircle2 className="size-16 text-yellow-accent mb-6" />
              <h2 className="text-3xl font-bold">You're all set</h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Our admissions team will reach out shortly. For urgent queries,
                call us directly.
              </p>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="mt-8 px-8 py-4 bg-yellow-accent text-navy-deep font-bold rounded-full"
              >
                Continue on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Field label="Full Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Aditya Sharma"
                  className="input-field"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  placeholder="+91 99999 99999"
                  className="input-field"
                />
              </Field>
              <Field label="Course of Interest" error={errors.course?.message}>
                <select {...register("course")} className="input-field" defaultValue="">
                  <option value="" disabled>
                    Select a course
                  </option>
                  <option value="IIT-JEE">IIT-JEE</option>
                  <option value="NEET">NEET</option>
                  <option value="CUET">CUET</option>
                  <option value="NDA">NDA</option>
                  <option value="Govt Jobs">Govt Jobs</option>
                </select>
              </Field>
              <Field label="Message (optional)" error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Anything specific you'd like to ask?"
                />
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 px-8 py-4 bg-yellow-accent text-navy-deep font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Submit Enquiry"
                )}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                By submitting you agree to be contacted by PJN Educare.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          color: var(--foreground);
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--yellow-accent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
