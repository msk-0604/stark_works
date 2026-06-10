"use client";

import { MapPin, Phone } from "lucide-react";

import type { Site } from "@/lib/types/database";
import { mapsHref, telHref } from "@/lib/utils/contact";

interface SiteQuickActionsProps {
  site: Site;
}

export function SiteQuickActions({ site }: SiteQuickActionsProps) {
  const actions = [
    site.phone && {
      icon: Phone,
      label: "電話",
      onClick: () => { window.location.href = telHref(site.phone!); },
      color: "bg-blue-700 text-white",
    },
    site.address && {
      icon: MapPin,
      label: "地図",
      onClick: () => { window.open(mapsHref(site.address!), "_blank"); },
      color: "bg-emerald-700 text-white",
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; onClick: () => void; color: string }[];

  if (actions.length === 0) return null;

  return (
    <div className="fixed bottom-[var(--nav-height)] left-0 right-0 z-40 border-t-2 border-slate-400 bg-white px-3 py-3 shadow-[0_-6px_24px_rgba(0,0,0,0.12)] md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, onClick, color }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`tap-scale flex min-h-[72px] items-center justify-center gap-2 rounded-xl text-xl font-bold ${color}`}
          >
            <Icon className="h-8 w-8" strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
