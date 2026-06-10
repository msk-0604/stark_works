"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SiteSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SiteSearch({ value, onChange, resultCount, totalCount }: SiteSearchProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="現場名・顧客名・住所・担当者で検索"
          className="min-h-[64px] pl-14 pr-14 text-xl"
          aria-label="現場を検索"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="tap-scale absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-200"
            aria-label="検索をクリア"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      {value && (
        <p className="text-lg font-semibold text-muted-foreground">
          {resultCount}件 / 全{totalCount}件
        </p>
      )}
    </div>
  );
}
