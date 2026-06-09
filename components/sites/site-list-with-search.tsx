"use client";

import { useMemo, useState } from "react";

import { SiteList } from "@/components/sites/site-list";
import { SiteSearch } from "@/components/sites/site-search";
import type { SiteWithProgress } from "@/lib/types/database";

interface SiteListWithSearchProps {
  sites: SiteWithProgress[];
}

function matchesQuery(site: SiteWithProgress, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [site.name, site.customer_name, site.address]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(q));
}

export function SiteListWithSearch({ sites }: SiteListWithSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => sites.filter((site) => matchesQuery(site, query)),
    [sites, query]
  );

  return (
    <div className="space-y-4">
      <SiteSearch
        value={query}
        onChange={setQuery}
        resultCount={filtered.length}
        totalCount={sites.length}
      />
      <SiteList
        sites={filtered}
        emptyMessage={query ? "該当する現場がありません" : undefined}
        emptyActionHref={sites.length === 0 && !query ? "/sites/new" : undefined}
        emptyActionLabel={sites.length === 0 && !query ? "現場を登録する" : undefined}
      />
    </div>
  );
}
