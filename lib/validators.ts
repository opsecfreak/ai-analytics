import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const passkeySchema = z.object({
  passkey: z.string().min(6, { message: "Passkey must be at least 6 characters" }),
});
export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  displayName: z.string().min(1, { message: "Display name is required" }).optional(),
  phoneNumber: z.string().min(7, { message: "Phone number must be at least 7 characters" }).max(20, { message: "Phone number cannot exceed 20 characters" }).optional(),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).optional(),
  profilePicture: z.string().url({ message: "Invalid URL for profile picture" }).optional(),
});