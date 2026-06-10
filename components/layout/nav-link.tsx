"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

function LinkPendingOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      className="pointer-events-none absolute inset-0 rounded-lg bg-primary/15 animate-pulse"
      aria-hidden
    />
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  layout?: "sidebar" | "mobile";
}

export function NavLink({ href, label, icon: Icon, layout = "mobile" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  if (layout === "sidebar") {
    return (
      <Link
        href={href}
        prefetch
        className={cn(
          "relative flex min-h-[56px] items-center gap-3 rounded-lg px-4 text-lg font-bold transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
        )}
      >
        <LinkPendingOverlay />
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "tap-scale relative flex min-h-[72px] flex-col items-center justify-center gap-0.5 px-1 text-base font-bold",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <LinkPendingOverlay />
      {isActive && (
        <span className="absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary" />
      )}
      <Icon className={cn("h-7 w-7", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
