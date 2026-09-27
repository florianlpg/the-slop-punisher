"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { useUser } from "@clerk/nextjs"

import {
  LayoutDashboardIcon,
  SkullIcon,
  LogsIcon,
  BanknoteIcon,
  SettingsIcon,
  VoteIcon,
  ThumbsDownIcon,
} from "lucide-react"

import { NavMain } from "@/components/Dashboard/NavMain"
import { NavUser } from "@/components/Dashboard/NavUser"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const AccountDialog = dynamic(
  () =>
    import("@/components/Dashboard/AccountDialog").then(
      (module) => module.AccountDialog,
    ),
  {
    ssr: false,
  },
)

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Penalties",
      url: "/penalties",
      icon: <ThumbsDownIcon />,
    },
    {
      title: "Approbations",
      url: "/approbations",
      icon: <VoteIcon />,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: <BanknoteIcon />,
    },
    {
      title: "Rules",
      url: "/rules",
      icon: <SettingsIcon />,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: <LogsIcon />,
    },
  ],
}

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const { user, isLoaded } = useUser()

  const [
    isAccountDialogOpen,
    setIsAccountDialogOpen,
  ] = useState(false)

  const displayUser =
    isLoaded && user
      ? {
          name:
            user.fullName ??
            user.username ??
            "User",
          avatar: user.imageUrl,
        }
      : null

  return (
    <>
      <AccountDialog
        open={isAccountDialogOpen}
        setOpen={setIsAccountDialogOpen}
      />

      <Sidebar
        collapsible="offcanvas"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<a href="#" />}
              >
                <SkullIcon className="size-5!" />

                <span className="text-base font-semibold">
                  Slop Punisher
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser
            user={displayUser}
            isUserAccountClicked={
              isAccountDialogOpen
            }
            setIsUserAccountClicked={
              setIsAccountDialogOpen
            }
          />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
