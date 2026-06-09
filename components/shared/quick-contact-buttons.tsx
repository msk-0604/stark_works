import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { telHref, mapsHref } from "@/lib/utils/contact";
import { cn } from "@/lib/utils/cn";

interface QuickContactButtonsProps {
  phone?: string | null;
  address?: string | null;
  phoneLabel?: string;
  className?: string;
}

export function QuickContactButtons({
  phone,
  address,
  phoneLabel = "電話",
  className,
}: QuickContactButtonsProps) {
  if (!phone && !address) return null;

  const count = [phone, address].filter(Boolean).length;

  return (
    <div className={cn("grid gap-2", count > 1 ? "grid-cols-2" : "grid-cols-1", className)}>
      {phone && (
        <a
          href={telHref(phone)}
          onClick={(e) => e.stopPropagation()}
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-blue-700 text-lg font-bold text-white active:bg-blue-800"
        >
          <Phone className="h-6 w-6" strokeWidth={2.5} />
          {phoneLabel}
        </a>
      )}
      {address && (
        <a
          href={mapsHref(address)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-emerald-700 text-lg font-bold text-white active:bg-emerald-800"
        >
          <MapPin className="h-6 w-6" strokeWidth={2.5} />
          地図
        </a>
      )}
    </div>
  );
}

interface QuickContactLinksProps {
  siteId: string;
  phone?: string | null;
  address?: string | null;
}

export function QuickContactLinks({ siteId, phone, address }: QuickContactLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {phone && (
        <a
          href={telHref(phone)}
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-blue-700 text-lg font-bold text-white"
        >
          <Phone className="h-6 w-6" />
          電話
        </a>
      )}
      {address && (
        <a
          href={mapsHref(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-scale flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-emerald-700 text-lg font-bold text-white"
        >
          <MapPin className="h-6 w-6" />
          地図
        </a>
      )}
      <Link
        href={`/sites/${siteId}`}
        className="tap-scale col-span-2 flex min-h-[48px] items-center justify-center rounded-xl border-2 border-primary text-lg font-bold text-primary"
      >
        現場詳細を見る
      </Link>
    </div>
  );
}
