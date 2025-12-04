"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTravelOrder,
  forwardTravelRequestById,
  updateTravelRequestById,
  updateTravelRequestsByIds,
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

// UPDATE TRAVEL REQUEST
export function useUpdateTravelRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; userId: string }) => {
      const result = await updateTravelRequestById({
        id: data.id,
        userId: data.userId,
      });
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

// UPDATE TRAVEL REQUESTS
export function useUpdateTravelRequests(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ids: string[]; userId: string }) => {
      const result = await updateTravelRequestsByIds({
        ids: data.ids,
        userId: data.userId,
      });
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success("Travel order(s) processed successfully!");
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}

// FORWARD TRAVEL REQUEST
export function useForwardTravelRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; userId: string }) => {
      const result = await forwardTravelRequestById({
        id: data.id,
        userId: data.userId,
      });
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
