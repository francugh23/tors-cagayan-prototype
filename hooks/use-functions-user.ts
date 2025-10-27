"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser, deleteUserById, updateUser } from "@/actions/user-actions";
import type { z } from "zod";
import { AddUserSchema, EditUserSchema } from "@/schemas";

// CREATE
export function useCreateUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof AddUserSchema>) => {
      const result = await createUser(data);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}

// UPDATE
export function useUpdateUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof EditUserSchema>) => {
      const result = await updateUser(data);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}

// DELETE
export function useDeleteUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteUserById(id);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    },
  });
}