"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getUserData } from "@/utils/cookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "react-cookies";

export function NavUser() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [userDetails, setUserDetails] = useState(null);

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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src="/avatars/shadcn.jpg" alt={userDetails?.FullName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userDetails?.FullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userDetails?.DistrictName}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/avatars/shadcn.jpg" alt={userDetails?.FullName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userDetails?.FullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    District Name : {userDetails?.DistrictName}
                  </span>
                  {userDetails?.BlockName && (
                    <span className="text-muted-foreground truncate text-xs">
                      Block Name : {userDetails?.BlockName}
                    </span>
                  )}
                  <span className="text-muted-foreground truncate text-xs">
                    User Type : {userDetails?.UserTypeName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}