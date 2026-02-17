import { prisma } from "@/lib/prismaHelper";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest) => {
    const { name, email, password } = await request.json() as { name: string, email: string, password: string };
    const result = await prisma.user.create({
        data:{
            name,
            email,
            password
        }
    })
    return NextResponse.json({
        success: true,
        message: "Signup success",
        data: {
            email,
            name
        }
    })
}