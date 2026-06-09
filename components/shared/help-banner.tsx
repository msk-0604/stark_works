import { Info } from "lucide-react";

interface HelpBannerProps {
  text: string;
}

export function HelpBanner({ text }: HelpBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
      <Info className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
      <p className="text-lg leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
