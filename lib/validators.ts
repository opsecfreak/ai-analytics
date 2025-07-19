import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const passkeySchema = z.object({
  passkey: z.string().min(6, "Passkey must be at least 6 characters"),
});
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).optional(),
  phoneNumber: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
  // Add more fields as you want to allow users to update here
});