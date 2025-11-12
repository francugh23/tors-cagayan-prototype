"use client"

import { useQuery } from "@tanstack/react-query"

// READ
async function getDashboardForSignatory() {
  const res = await fetch("/api/dashboard")
  if (!res.ok) throw new Error("Failed to fetch dashboard data")
  return res.json()
}

export function useDashboardForSignatory() {
  return useQuery({
    queryKey: ["dashboard-signatory"],
    queryFn: getDashboardForSignatory,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  })
}