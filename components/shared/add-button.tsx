import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface AddButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function AddButton({ href, label, className }: AddButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "tap-scale flex min-h-[72px] w-full items-center justify-center gap-3 rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-md active:bg-primary/90",
        className
      )}
    >
      <Plus className="h-8 w-8" strokeWidth={2.5} />
      {label}
    </Link>
  );
}
