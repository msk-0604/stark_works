import { MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/types/database";

interface SiteInfoActionsProps {
  site: Site;
}

export function SiteInfoActions({ site }: SiteInfoActionsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-lg">
        {site.customer_name && <p><span className="font-bold">顧客:</span> {site.customer_name}</p>}
        {site.address && <p><span className="font-bold">住所:</span> {site.address}</p>}
        {site.start_date && <p><span className="font-bold">開始日:</span> {site.start_date}</p>}
        {site.expected_end_date && <p><span className="font-bold">完了予定:</span> {site.expected_end_date}</p>}
        {site.manager && <p><span className="font-bold">担当:</span> {site.manager.full_name}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {site.phone && (
          <Button asChild size="lg" className="w-full text-lg tap-scale">
            <a href={`tel:${site.phone.replace(/-/g, "")}`}>
              <Phone className="mr-2 h-6 w-6" />
              電話をかける
            </a>
          </Button>
        )}
        {site.address && (
          <Button asChild size="lg" variant="outline" className="w-full text-lg tap-scale">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(site.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-6 w-6" />
              地図を見る
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
