import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
  subtitle?: string;
}

export function PageHeader({ title, backHref, action, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-5 space-y-3">
      <div className="flex items-start gap-2">
        {backHref && (
          <Button variant="outline" size="icon" className="mt-0.5 h-12 w-12 shrink-0 tap-scale" asChild>
            <Link href={backHref} aria-label="戻る">
              <ArrowLeft className="h-7 w-7" />
            </Link>
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <div className={cn("w-full", backHref ? "pl-14" : "")}>
          <div className="w-full [&_a]:w-full [&_button]:w-full">{action}</div>
        </div>
      )}
    </div>
  );
}
