"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
   const pathname = usePathname(); // Get the current path
    const [currentPath, setCurrentPath] = useState(pathname); // State to manage the current path
  
    useEffect(() => {
      // You can use the pathname here
      setCurrentPath(pathname);
    }, [pathname]); // Update the state when pathname changes

    // Define a mapping of paths to titles
  const pathTitles = {
    "/analytics": "Analytics",
    "/dashboard": "Dashboard",
    "/settings": "Settings",
    "/profile": "Profile",
    "/notifications": "Notifications",
    "/help": "Help",
    "/growth-breakdowns": "Growth Rate",
    "/health-metrics": "Health Metrics",
    "/livelihoods": "Livelihoods",
    "/welfare": "Welfare",
    "/reports": "Reports",
    "/no-of-members": "No. of Members",
    "/surveyed-households": "Surveyed Households",
  };

    // Get the title for the current path, or use a default value
    const pageTitle = pathTitles[currentPath] || "Page Not Found";

  return (
    (<header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">
          {pageTitle}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" asChild size="sm" className="hidden sm:flex hover:bg-red-100">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-red-700 text-red-500">
              Logout
            </a>
          </Button>
        </div>
      </div>
    </header>)
  );
}
