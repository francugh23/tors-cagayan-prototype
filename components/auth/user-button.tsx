"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="h-[50px]">
          <Avatar className="w-7 h-7 rounded-md">
            <AvatarImage src={user?.user?.image || ""} />
            <AvatarFallback className="bg-[#FBF3B9]">
              <FaUser className="text-black" />
            </AvatarFallback>
          </Avatar>
          <span className="flex flex-col">
            <p className="text-xs font-bold">{user?.user?.name}</p>
            <p
              className="font-semibold"
              style={{
                fontSize: "0.65rem",
              }}
            >
              {user?.user?.email}
            </p>
          </span>
          <ChevronsUpDown className="ml-auto" size={20} />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="bg-white border rounded-md w-[200px] p-2 text-sm my-1"
      >
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
