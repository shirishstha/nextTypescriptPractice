import { z } from "zod"

export const signupSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters"),

    email: z
        .email("Invalid email format"),

    password: z
        .string()
        .min(7, "Password must be at least 7 charaters long")
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[0-9]/, "Must contain at least a number"),
});

export const loginSchema = z.object({
    email: z
        .email("Inavlid email format"),
    password: z
        .string()
        .min(1, "Password must be set")
})

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;