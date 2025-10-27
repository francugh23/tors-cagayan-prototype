"use client";

import { useQuery } from "@tanstack/react-query";

// READ
async function getUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 30,
    // refetchOnWindowFocus: false,
  })
}