import z from "zod";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const signUpObject = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});
export const signInObject = z.object({
  email: z.string(),
});

export const createRoomObject = z.object({
  name: z.string().min(3).max(20),
});
