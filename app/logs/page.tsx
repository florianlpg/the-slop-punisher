import { AppSidebar } from "@/components/Dashboard/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { LogsTable } from "@/components/Logs/LogsTable/LogsTable";

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <LogsTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
