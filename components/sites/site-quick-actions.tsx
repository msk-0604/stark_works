"use client";

import { Camera, CheckCircle, MapPin, Phone } from "lucide-react";

import type { Site } from "@/lib/types/database";

interface SiteQuickActionsProps {
  site: Site;
  nextTaskId?: string;
}

export function SiteQuickActions({ site, nextTaskId }: SiteQuickActionsProps) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleComplete() {
    if (nextTaskId) {
      const btn = document.querySelector(`[data-task-complete="${nextTaskId}"]`) as HTMLButtonElement;
      if (btn) {
        scrollTo("tasks");
        setTimeout(() => btn.click(), 400);
        return;
      }
    }
    scrollTo("tasks");
  }

  const actions = [
    site.phone && {
      icon: Phone,
      label: "電話",
      onClick: () => { window.location.href = `tel:${site.phone!.replace(/-/g, "")}`; },
      color: "bg-blue-600 text-white",
    },
    site.address && {
      icon: MapPin,
      label: "地図",
      onClick: () => {
        window.open(`https://maps.google.com/?q=${encodeURIComponent(site.address!)}`, "_blank");
      },
      color: "bg-emerald-600 text-white",
    },
    {
      icon: Camera,
      label: "写真",
      onClick: () => scrollTo("photos"),
      color: "bg-amber-600 text-white",
    },
    {
      icon: CheckCircle,
      label: "完了",
      onClick: handleComplete,
      color: "bg-primary text-primary-foreground",
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; onClick: () => void; color: string }[];

  return (
    <div className="fixed bottom-[var(--nav-height)] left-0 right-0 z-40 border-t-2 border-border bg-card/95 px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-sm md:static md:mb-4 md:rounded-xl md:border-2 md:shadow-md">
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-2">
        {actions.map(({ icon: Icon, label, onClick, color }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`tap-scale flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl ${color}`}
          >
            <Icon className="h-7 w-7" strokeWidth={2.5} />
            <span className="text-sm font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
