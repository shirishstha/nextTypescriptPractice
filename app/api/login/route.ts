import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setSession, setUser } from "@/lib/session";
import { prisma } from "@/lib/prismaHelper";
import { errorResponse, successResponse } from "../responseHandler";
import { loginSchema } from "@/lib/validations/auth.schema";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        //validation
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            throw new Error(parsed.error.message);
        }

        const { email, password } = parsed.data;

        //fetching data form database
        const user = await prisma.user.findUnique({
            where: { email }
        })

        //if there is no user
        if (!user) {
            throw new Error("No user found with that id");
        }

        // checking if the password matches or not
        if (password !== user?.password) {
            throw new Error("Email and password doesnot matched.");
        }

        //creating user session in database
        const userSession = await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60)
            }
        })

        //encoding session with jwt
        const secret = process.env.JWTKEY;
        const sid = userSession.id;

        if (!secret) throw new Error();

        const token = jwt.sign({ sid }, secret, { expiresIn: "1h" });
        const uid = user.id;
        const role = user.role;
        const name = user.name;
        const signedUser = jwt.sign({ uid, role, name, email }, secret, { expiresIn: "1h" })

        //setting up the cookie 
        await setSession(token, userSession.expiresAt);
        await setUser(signedUser, userSession.expiresAt);

        return successResponse({}, "Login success", 200);
    } catch (error) {
        if (error instanceof Error) {
            return errorResponse(error.message);
        }
    }
}
