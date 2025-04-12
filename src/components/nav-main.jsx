"use client";

import { IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BellDot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { useEffect, useState } from "react";

export function NavMain({ items }) {
  const pathname = usePathname(); // Get the current path
  const [currentPath, setCurrentPath] = useState(pathname); // State to manage the current path

  useEffect(() => {
    // You can use the pathname here
    setCurrentPath(pathname);
  }, [pathname]); // Update the state when pathname changes


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-white hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <BellDot />
              <span>Notification(s)</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0 relative"
              variant="outline"
            >
              <IconMail />
              <div className="absolute bg-red-600 h-2 w-2 rounded-full -right-0.5 -top-0.5" />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="group">
          {items?.map((item, i) => (
            <SidebarMenuItem
              key={i}
             
            >
              <Link href={item?.url || "#"}>
                <SidebarMenuButton  className={`cursor-pointer ${
                currentPath == item.url ? "bg-[#77B254] active:bg-[#77B254]  hover:bg-[#5B913B] rounded-md hover:text-white text-white" : ""
              }`} tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
