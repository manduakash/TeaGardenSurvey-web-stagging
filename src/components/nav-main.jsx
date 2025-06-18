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
import { getUserData } from "@/utils/cookies";

export function NavMain({ items }) {
  const pathname = usePathname(); // Get the current path
  const [currentPath, setCurrentPath] = useState(pathname); // State to manage the current path
  const [isAdmin, setIsAdmin] = useState(false); // State to manage the current path
  const [userTypeID, setUserTypeID] = useState(1);
  const userType = getUserData()?.UserTypeID;
  
  useEffect(() => {
    setUserTypeID(userType);
    console.log(userType);
    
  }, [userType]);

  useEffect(() => {
    // You can use the pathname here
    setCurrentPath(pathname);
    setIsAdmin(userTypeID == 4 ? true : false);
  }, [pathname,userTypeID]); // Update the state when pathname changes


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        
        <SidebarMenu className="group">
          {items?.map((item, i) => (
             (
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
            )
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
