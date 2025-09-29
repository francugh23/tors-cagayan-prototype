import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";
import { AppSidebar } from "./_components/sidebar";
import { DevHoverCard } from "@/components/dev-card";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    // <div className="flex flex-col min-h-screen">
    //   <Navbar />
    //   <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FBF3B9] to-[#FFEFC8]">
    //     {children}
    //   </div>
    // </div>
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
  );
};

export default ProtectedLayout;
