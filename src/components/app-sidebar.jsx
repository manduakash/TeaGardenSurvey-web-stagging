"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react"
import Icon from "@/assets/favicon/android-chrome-512x512.png";

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartNoAxesCombined, FileChartLine, FileChartPie, HandHeart, House, Sprout, Stethoscope } from "lucide-react"
import Image from "next/image"

const data = {
  user: {
    name: "Admin",
    email: "user@admin.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Surveyed Households",
      url: "/surveyed-households",
      icon: House,
    },
    // {
    //   title: "Growth Breakdowns",
    //   url: "/growth-breakdowns",
    //   icon: FileChartLine,
    // },
    {
      title: "Health Metrics",
      url: "/health-metrics",
      icon: Stethoscope,
    },
    {
      title: "Livelihoods",
      url: "/livelihoods",
      icon: IconListDetails,
    },
    {
      title: "Welfare",
      url: "/welfare",
      icon: HandHeart,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileChartPie,
    },
    {
      title: "No. of Members",
      url: "/no-of-members",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                {/* <Sprout className="!size-5 border rounded-md text-green-600 bg-green-100 border-green-700/20" /> */}
                <div className="flex items-center justify-center p-0 rounded-full ring-2 ring-[#77B254] bg-green-200 dark:bg-slate-800">
                  <Image src={Icon} alt="logo" width={22} height={22} />
                </div>
                <span className="text-base font-semibold">Tea Garden Survey.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
