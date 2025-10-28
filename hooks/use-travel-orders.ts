"use client"

import { useQuery } from "@tanstack/react-query"

// READ
async function getTravelOrders() {
  const res = await fetch("/api/home")
  if(!res.ok) throw new Error("Failed to fetch travel orders")
    return res.json()
}

export function useTravelOrders() {
  return useQuery({
    queryKey: ["travelOrders"],
    queryFn: getTravelOrders
  })
}

async function getTravelRequestsForSignatory() {
  const res = await fetch("/api/signatory")
  if(!res.ok) throw new Error("Failed to fetch travel requests for signatory")
  return res.json()
}

export function useTravelRequestsForSignatory() {
  return useQuery({
    queryKey: ["travelRequestsForSignatory"],
    queryFn: getTravelRequestsForSignatory
  })
}