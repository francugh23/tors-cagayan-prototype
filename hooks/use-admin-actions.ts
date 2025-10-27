"use client";

import { useQuery } from "@tanstack/react-query";

// READ
async function getAdminActions() {
  const res = await fetch("/api/admin-actions");
  if (!res.ok) throw new Error("Failed to fetch admin actions");
  return res.json();
}

export function useAdminActions() {
  return useQuery({
    queryKey: ["admin-actions"],
    queryFn: getAdminActions,
    staleTime: 1000 * 30,
    refetchInterval: 5000,
    // refetchOnWindowFocus: false,
  })
}