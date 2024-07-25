import { z } from "zod";


export const usernameValidation = z.string().min(3).max(20);
export const signUpSchemaValidation = z.object({
  username:usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be at most 100 characters long")
      .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
});