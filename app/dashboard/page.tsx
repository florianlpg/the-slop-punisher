import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
