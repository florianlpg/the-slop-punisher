"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { QuickCreateDialog } from "@/components/Dashboard/QuickCreateDialog";

import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <QuickCreateDialog />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} href={item.url} className="cursor-pointer">
              <SidebarMenuItem
                style={{
                  backgroundColor: pathname === item.url ? "var(--muted)" : "",
                  borderRadius: "var(--radius)",
                }}
                className="cursor-pointer hover:bg-muted rounded-lg p-1.5 transition-colors :outline-none  disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SidebarMenuButton
                  style={{
                    backgroundColor:
                      pathname === item.url ? "var(--muted)" : "transparent",
                    borderRadius: "var(--radius)",
                  }}

                  tooltip={item.title}
                  className="cursor-pointer"
                >
                  {item.icon}
                  <span className="cursor-pointer">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
