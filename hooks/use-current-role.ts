// import { useSession } from "next-auth/react";

// export const useCurrentRole = () => {
//   const session = useSession();
//   return session.data?.user.role;
// };

"use client";

import { getCurrentUser } from "@/actions/server";
import { useEffect, useState } from "react";

export const useCurrentRole = () => {
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const response = await getCurrentUser();
      setUserRole(response?.user?.role as string);
    }
    fetchData();
  }, []);

  console.log(userRole);
  return userRole?.length > 0 ? userRole : "unknown";
};
