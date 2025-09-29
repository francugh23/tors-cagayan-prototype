"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { title } from "@/components/fonts/font";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const user = useCurrentUser();

  return (
    <section className="relative w-full">
      <nav className="bg-secondary flex justify-between items-center shadow-sm sticky right-0 left-0 top-0 py-3 px-5 bg-white h-16 z-40">
        <span className="w-full sm:w-1/2 flex items-center gap-3">
          <SidebarTrigger className="h-6 w-6 sm:h-7 sm:w-7" />
          <div className="text-slate-400">|</div>
          {user ? (
            <h1 className={cn("text-md text-slate-600 uppercase text-muted-foreground", title.className)}>
              Good day, {user?.user?.name}!👋
            </h1>
          ) : (
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          )}
        </span>
      </nav>
    </section>
  );
};
