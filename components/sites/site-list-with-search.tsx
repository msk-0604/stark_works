"use client";

import { useMemo, useState } from "react";

import { SiteList } from "@/components/sites/site-list";
import { SiteSearch } from "@/components/sites/site-search";
import type { SiteListItem } from "@/lib/types/database";
import { sortSitesForList } from "@/lib/utils/site";

interface SiteListWithSearchProps {
  sites: SiteListItem[];
}

function matchesQuery(site: SiteListItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const fields = [
    site.name,
    site.customer_name,
    site.address,
    site.assignee_name,
    ...site.assignee_names,
  ];

  return fields.filter(Boolean).some((field) => field!.toLowerCase().includes(q));
}

export function SiteListWithSearch({ sites }: SiteListWithSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const matched = sites.filter((site) => matchesQuery(site, query));
    return sortSitesForList(matched);
  }, [sites, query]);

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
