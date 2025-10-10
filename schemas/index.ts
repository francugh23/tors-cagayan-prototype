import { UserRole } from '@prisma/client';
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.ACCOUNT_HOLDER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Old password is required!",
      path: ["password"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required.",
  }),
});

export const AddUserSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  stationId: z.string().min(1, "Permanent Station is required."),
  role: z.nativeEnum(UserRole),
  signature: z.string().optional(),
  positionDesignation: z.string().min(1, "Position/Designation is required."),
});

export const TravelFormSchema = z.object({
  requester_name: z.string().min(1, { message: "Requester's name is required." }),
  position: z.string().min(1, { message: "Position is required." }),
  purpose: z.string().min(1, { message: "Purpose is required." }),
  host: z.string().min(1, { message: "Host is required." }),
  travel_period: z.string().min(1, { message: "Inclusive Dates is required." }),
  destination: z.string().min(1, { message: "Destination is required." }),
  fund_source: z.string().min(1, { message: "Fund Source is required." }),
  attached_file: z.instanceof(File, { message: "Attachment is required." }),
});

export const RemarksSchema = z.object({
  travelOrderId: z.string(),
  userId: z.string(),
  remarks: z.string().min(1, { message: "Remarks is required." }),
})