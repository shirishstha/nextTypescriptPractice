import { prisma } from "@/lib/prismaHelper";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "../responseHandler";
import { signupSchema } from "@/lib/validations/auth.schema";


export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }

        const { name, email, password } = parsed.data;
        const exists = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (exists) {
            throw new Error("User already exists.");
        }

        const result = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })
        if (!result) {
            throw new Error("Couldnot create user");
        }

        return successResponse({ name, email }, "User created successfully", 201);

    } catch (error) {
        if (error instanceof Error) {
            return errorResponse(error.message);
        }
    }
}