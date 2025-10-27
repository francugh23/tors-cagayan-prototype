"use client";

import { useQuery } from "@tanstack/react-query";

export const useDesignations = () => {
  return useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const res = await fetch("/api/designations");
      if (!res.ok) throw new Error("Failed to fetch designations");
      return res.json();
    },
  });
};
