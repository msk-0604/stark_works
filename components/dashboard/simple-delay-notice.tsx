import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import type { DelayedSite } from "@/lib/types/database";

interface SimpleDelayNoticeProps {
  sites: DelayedSite[];
}

export function SimpleDelayNotice({ sites }: SimpleDelayNoticeProps) {
  if (sites.length === 0) return null;

  return (
    <Link
      href="/sites"
      className="tap-scale flex items-center gap-3 rounded-xl border-2 border-red-400 bg-red-50 p-4"
    >
      <AlertTriangle className="h-8 w-8 shrink-0 text-red-600" />
      <p className="text-xl font-bold text-red-800">
        工期超過の現場が {sites.length}件あります → 確認する
      </p>
    </Link>
  );
}
