"use client";

import {
  ChevronRight,
  Layers,
  Home,
  LucideIcon,
  NotebookPen,
  UsersRound,
  Loader,
  SquareStack,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { usePathname, useRouter } from "next/navigation";
import AppSidebarFooter from "./sidebar-footer";
import { UserRole } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";

export function AppSidebar() {
  const user = useCurrentUser();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="font-medium shadow"
    >
      {/* HEADER */}
      <SidebarHeader className="bg-white min-h-[100px] p-0">
        <section className="w-full h-full flex gap-1 justify-center items-center">
          <span>
            <Image
              src="/e-logo.svg"
              alt="App Logo"
              width={200}
              height={200}
              loading="lazy"
            />
          </span>
        </section>
        <Separator />
      </SidebarHeader>

      <SidebarContent className="bg-white gap-2">
        {/* NAVIGATION */}
        {user?.user?.role === UserRole.ADMIN && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuSingle
                menuItems={[
                  { menuTitle: "Users", url: "/users", menuIcon: UsersRound },
                ]}
              />
              <SidebarMenuSingle
                menuItems={[
                  {
                    menuTitle: "Logs",
                    url: "/server",
                    menuIcon: Layers,
                  },
                ]}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user?.user?.role === UserRole.CLIENT && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuSingle
                menuItems={[
                  { menuTitle: "Home", url: "/home", menuIcon: Home },
                ]}
              />
              <SidebarMenuSingle
                menuItems={[
                  {
                    menuTitle: "Travel Order",
                    url: "/client",
                    menuIcon: NotebookPen,
                  },
                ]}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user?.user?.role === UserRole.SIGNATORY && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuSingle
                menuItems={[
                  {
                    menuTitle: "Dashboard",
                    url: "/dashboard",
                    menuIcon: LayoutDashboard,
                  },
                ]}
              />
              <SidebarMenuSingle
                menuItems={[
                  {
                    menuTitle: "Pending Requests",
                    url: "/signatory",
                    menuIcon: Loader,
                  },
                ]}
              />
              <SidebarMenuSingle
                menuItems={[
                  {
                    menuTitle: "History",
                    url: "/signatory-history",
                    menuIcon: SquareStack,
                  },
                ]}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}

// SidebarMenuSingle.tsx
type SidebarMenuSingleType = {
  menuTitle: string;
  menuIcon?: LucideIcon;
  url: string;
};
interface SidebarMenuSingleProps {
  menuItems: SidebarMenuSingleType[];
}
function SidebarMenuSingle({ menuItems }: SidebarMenuSingleProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {menuItems.map((item: SidebarMenuSingleType, index: number) => {
        const isActive = pathname === item.url;

        return (
          <span key={index}>
            <SidebarMenu
              onClick={() => router.push(item.url)}
              className={`cursor-pointer transition-all ease-in-out duration-300 hover:bg-gray-50 ${
                isActive
                  ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FBF3B9] to-[#FFEFC8] rounded-md"
                  : "active:bg-green-100"
              }`}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span
                    className={`flex items-center gap-2 transition-all ease-in-out duration-200 hover:text-green-700 ${
                      isActive ? "text-primary" : "active:text-secondary"
                    }`}
                  >
                    {item.menuIcon && <item.menuIcon />}
                    <span>{item.menuTitle}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </span>
        );
      })}
    </>
  );
}

// SidebarMenuCollapsible.tsx
type SidebarMenuSubItem = {
  title: string;
  icon?: LucideIcon;
  url: string;
};
interface SidebarMenuCollapsible {
  menuTitle?: string;
  menuIcon?: LucideIcon;
  subMenus?: SidebarMenuSubItem[];
}
function SidebarMenuCollapsible({
  menuTitle,
  menuIcon: Icon,
  subMenus,
}: SidebarMenuCollapsible) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="peer-data-[active=true]/menu-button:opacity-100 hover:bg-gray-100 active:bg-gray-200"
              asChild
            >
              <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary active:text-secondary">
                {Icon && <Icon size={16} />}
                {menuTitle || ""}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>
                {subMenus?.map((subMenu, index) => {
                  const isActive = pathname === subMenu.url;

                  return (
                    <SidebarMenuSubItem key={index}>
                      <SidebarMenuButton
                        onClick={() => router.push(subMenu.url)}
                        className={`flex items-center gap-2 transition-all ease-in-out duration-300 hover:text-green-700 hover:bg-gray-50 ${
                          isActive
                            ? "bg-gray-100 text-green-700"
                            : "active:bg-green-100 active:text-secondary"
                        }`}
                      >
                        {subMenu.icon && <subMenu.icon />}
                        {subMenu.title}
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
