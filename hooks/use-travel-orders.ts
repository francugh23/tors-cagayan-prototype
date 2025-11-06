"use client"

import { useQuery } from "@tanstack/react-query"

// READ TRAVEL ORDERS
async function getTravelOrders() {
  const res = await fetch("/api/home")
  if(!res.ok) throw new Error("Failed to fetch travel orders")
    return res.json()
}

export function useTravelOrders() {
  return useQuery({
    queryKey: ["travelOrders"],
    queryFn: getTravelOrders,
    staleTime: 1000 * 30,
    refetchInterval: 5000,
  })
}

// READ TOs for SIGNATORY
async function getTravelRequestsForSignatory() {
  const res = await fetch("/api/signatory")
  if(!res.ok) throw new Error("Failed to fetch travel requests for signatory")
  return res.json()
}

export function useTravelRequestsForSignatory() {
  return useQuery({
    queryKey: ["travelRequestsForSignatory"],
    queryFn: getTravelRequestsForSignatory,
    staleTime: 1000 * 30,
    refetchInterval: 5000,
  })
}

// SIGNATORY HISTORY
async function getSignatoryHistory() {
  const res = await fetch("/api/signatory-history")
  if(!res.ok) throw new Error("Failed to fetch signatory history")
  return res.json()
}

export function useSignatoryHistory() {
  return useQuery({
    queryKey: ["signatoryHistory"],
    queryFn: getSignatoryHistory,
    staleTime: 1000 * 30,
    refetchInterval: 5000,
  })
}