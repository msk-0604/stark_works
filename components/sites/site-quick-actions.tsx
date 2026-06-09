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
      label: "電話する",
      onClick: () => { window.location.href = `tel:${site.phone!.replace(/-/g, "")}`; },
      color: "bg-blue-700 text-white",
    },
    site.address && {
      icon: MapPin,
      label: "Googleマップ",
      onClick: () => {
        window.open(`https://maps.google.com/?q=${encodeURIComponent(site.address!)}`, "_blank");
      },
      color: "bg-emerald-700 text-white",
    },
    {
      icon: Camera,
      label: "写真を見る",
      onClick: () => scrollTo("photos"),
      color: "bg-amber-600 text-white",
    },
    {
      icon: CheckCircle,
      label: "作業完了",
      onClick: handleComplete,
      color: "bg-primary text-primary-foreground",
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; onClick: () => void; color: string }[];

  return (
    <div className="fixed bottom-[var(--nav-height)] left-0 right-0 z-40 border-t-2 border-slate-400 bg-white px-2 py-3 shadow-[0_-6px_24px_rgba(0,0,0,0.12)] md:static md:mb-4 md:rounded-xl md:border-2 md:shadow-md">
      <p className="mb-2 text-center text-sm font-bold text-muted-foreground md:hidden">クイックアクション</p>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map(({ icon: Icon, label, onClick, color }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`tap-scale flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl px-2 ${color}`}
          >
            <Icon className="h-8 w-8" strokeWidth={2.5} />
            <span className="text-base font-bold leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
