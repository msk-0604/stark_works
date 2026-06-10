import { MapPin, Phone } from "lucide-react";

import { ProgressBar } from "@/components/sites/progress-bar";
import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/types/database";
import { mapsHref, telHref } from "@/lib/utils/contact";

interface SiteHeaderProps {
  site: Site;
  progress: number;
}

export function SiteHeader({ site, progress }: SiteHeaderProps) {
  return (
    <section className="space-y-4 rounded-2xl border-2 border-primary bg-white p-5 shadow-md">
      <div>
        <h2 className="text-2xl font-bold leading-snug">{site.name}</h2>
        {site.address && (
          <p className="mt-2 flex items-start gap-2 text-xl text-muted-foreground">
            <MapPin className="mt-1 h-6 w-6 shrink-0" />
            {site.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {site.phone && (
          <Button asChild size="lg" className="min-h-[72px] text-xl tap-scale">
            <a href={telHref(site.phone)}>
              <Phone className="mr-2 h-7 w-7" />
              電話
            </a>
          </Button>
        )}
        {site.address && (
          <Button asChild size="lg" variant="outline" className="min-h-[72px] text-xl tap-scale">
            <a href={mapsHref(site.address)} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-7 w-7" />
              地図
            </a>
          </Button>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xl font-bold">進捗 {progress}%</span>
        </div>
        <ProgressBar percent={progress} size="lg" />
      </div>
    </section>
  );
}
