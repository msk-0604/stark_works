import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  href?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, href, className }: StatCardProps) {
  const content = (
    <Card className={cn("tap-scale border-2 transition-shadow active:border-primary", href && "cursor-pointer", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-muted-foreground">{title}</CardTitle>
        <Icon className="h-8 w-8 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
