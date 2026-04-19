import { Phone, MessageCircle } from "lucide-react";

export function MobileActionBar({
  phone,
  whatsapp,
}: {
  phone?: string;
  whatsapp?: string;
}) {
  const ph = phone || "+919999999999";
  const wa = (whatsapp || "+919999999999").replace(/[^\d]/g, "");
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-3 border-t border-border bg-background/90 backdrop-blur-xl">
      <a
        href={`tel:${ph}`}
        className="flex flex-col items-center justify-center py-3 text-xs font-semibold gap-1"
      >
        <Phone className="size-5 text-yellow-accent" />
        Call
      </a>
      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center justify-center py-3 text-xs font-semibold gap-1 bg-yellow-accent text-navy-deep"
      >
        <MessageCircle className="size-5" />
        WhatsApp
      </a>
      <a
        href="/contact"
        className="flex flex-col items-center justify-center py-3 text-xs font-semibold gap-1"
      >
        <span className="size-5 rounded-full bg-yellow-accent text-navy-deep flex items-center justify-center text-[10px] font-bold">
          ✦
        </span>
        Enroll
      </a>
    </div>
  );
}
