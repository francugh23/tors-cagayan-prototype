"use client";

import { useQuery } from "@tanstack/react-query";

export const usePositions = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await fetch("/api/positions");
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json();
    },
  });
};
