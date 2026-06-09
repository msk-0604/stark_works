"use client";

import { useState } from "react";

import { deleteSite } from "@/lib/actions/sites";
import { Button } from "@/components/ui/button";

interface DeleteSiteButtonProps {
  siteId: string;
  siteName: string;
}

export function DeleteSiteButton({ siteId, siteName }: DeleteSiteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${siteName}」を削除しますか？`)) return;
    setLoading(true);
    await deleteSite(siteId);
  }

  return (
    <Button variant="destructive" size="lg" onClick={handleDelete} disabled={loading} className="w-full">
      {loading ? "削除中..." : "この現場を削除"}
    </Button>
  );
}
