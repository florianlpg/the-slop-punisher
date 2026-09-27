import { AppSidebar } from "@/components/Dashboard/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ApprobationsTable } from "@/components/Approvals/ApprovalsTable/ApprovalsTable"

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
            <ApprobationsTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
