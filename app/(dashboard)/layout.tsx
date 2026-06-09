import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 pb-nav md:px-6 md:py-6 md:pb-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
