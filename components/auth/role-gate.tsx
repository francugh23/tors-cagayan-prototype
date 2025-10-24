"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();
  const router = useRouter();

  if (role !== allowedRole) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <ShieldAlert className="text-destructive" size={75} />
              </div>
            </div>

            <h1 className="mb-2 text-5xl font-bold text-foreground">403</h1>

            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Access Forbidden
            </h2>

            <p className="mb-8 text-muted-foreground">
              You do not have permission to view this content. This page
              requires{" "}
              <span className="font-semibold text-foreground">
                {allowedRole}
              </span>{" "}
              role access.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => router.push("/home")}
                className="w-full sm:w-auto"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};
