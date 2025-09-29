"use client";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "@/components/auth/user-button";

const AppSidebarFooter = () => {
  const user = useCurrentUser();

  return (
    <SidebarFooter className="bg-white">
      {user == null ? (
        <>
          <Skeleton className="w-full h-[50px] rounded-md" />
        </>
      ) : (
        <SidebarMenu className="cursor-pointer">
          <SidebarMenuItem>
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </SidebarFooter>
  );
};
export default AppSidebarFooter;
