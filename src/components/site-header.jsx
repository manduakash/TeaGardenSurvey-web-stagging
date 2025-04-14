"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getUserData } from "@/utils/cookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "react-cookies";

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  useEffect(() => {
    // Fetch user details on the client side
    const details = getUserData();
    setUserDetails(details);
  }, []);

  if (!userDetails) {
    // Render a placeholder or nothing until user details are available
    return null;
  }
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userDetails?.UserID }), // Use the correct user ID from userDetails
      });

      if (response.ok) {
        // Remove all cookies
        Cookies.remove("userData", { path: "/" });

        // Redirect to the landing page
        router.push("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex hover:bg-red-100 hover:text-red-700 text-red-500"
            onClick={handleLogout} // Attach the onClick event directly to the Button
          >
            Logout
          </Button>
        </div>
      </div>
    </header>)
  );
}
