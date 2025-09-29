// import { useSession } from "next-auth/react";

// export const useCurrentUser = () => {
//   const session = useSession();

//   return session.data?.user
// }

"use client";

import { getCurrentUser } from "@/actions/server";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    async function fetchData() {
      const response = await getCurrentUser();
      setUser(response);
    }
    fetchData();
  }, []);

  return user || {};
}
