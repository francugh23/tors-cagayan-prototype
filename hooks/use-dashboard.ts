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

// READ ANALYTICS
async function getAnalyticsForSignatory(range: string) {
  const res = await fetch(`/api/dashboard/analytics?range=${range}`);
  if (!res.ok) throw new Error("Failed to fetch analytics data");
  return res.json();
}

export function useAnalyticsForSignatory(range: string) {
  return useQuery({
    queryKey: ["analytics-signatory", range],
    queryFn: () => getAnalyticsForSignatory(range),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}