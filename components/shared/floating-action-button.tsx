import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface FloatingActionButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function FloatingActionButton({ href, label, className }: FloatingActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "tap-scale fixed bottom-[calc(var(--nav-height)+1rem)] right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden",
        className
      )}
      aria-label={label}
    >
      <Plus className="h-8 w-8" strokeWidth={2.5} />
    </Link>
  );
}
