"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./_components/navbar";
import { AppSidebar } from "./_components/sidebar";
import { DevHoverCard } from "@/components/dev-card";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FBF3B9] to-[#FFEFC8]">
          <main className="w-full">
            <Navbar />
            <div className="p-5">{children}</div>
          </main>
        </SidebarInset>
        <DevHoverCard />
      </SidebarProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
