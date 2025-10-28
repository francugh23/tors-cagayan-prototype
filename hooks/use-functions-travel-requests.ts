"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTravelOrder,
  updateTravelRequestById,
} from "@/actions/travel-order";
import type { z } from "zod";
import { TravelFormSchema } from "@/schemas";

// CREATE
export function useCreateTravelRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof TravelFormSchema>) => {
      const result = await createTravelOrder(data);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}

// UPDATE
export function useUpdateTravelRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; userId: string }) => {
      const result = await updateTravelRequestById(data);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}
