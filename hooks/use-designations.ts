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

export const useDesignationById = (id?: string) => {
  return useQuery({
    queryKey: ["designation", id],
    queryFn: async () => {
      if (!id) throw new Error("No designation ID provided.");
      const res = await fetch(`/api/designations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch designation.");
      return res.json();
    },
    enabled: !!id,
  });
};
