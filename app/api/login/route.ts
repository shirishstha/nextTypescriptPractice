import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setSession, setUser } from "@/lib/session";
import { prisma } from "@/lib/prismaHelper";
import { successResponse } from "../responseHandler";

export const POST = async (request: NextRequest) => {
    const { email, password } = (await request.json()) as { email: string, password: string };

    //empty field validation
    if (!email || !password) {
        console.log("Didnot receive credintials properly.");
        return NextResponse.json({
            success: false,
            message: "Didnot receive data properly",
        }, { status: 403 })
    }

    //fetching data form database
    const user = await prisma.user.findUnique({
        where: { email }
    })

    //if there is no user
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Cannot find the user with that email",
        }, { status: 401 })
    }

    // checking if the password matches or not
    if (password !== user?.password) {
        console.log("Email and password didnot matched.");
        return NextResponse.json({
            success: false,
            message: "Email and password doesnot matched",
        }, { status: 401 })
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
    if (!secret) return NextResponse.json({
        success: false,
        message: "Cannot find the secret",
    }, { status: 403 })

    const token = jwt.sign({ sid }, secret, { expiresIn: "1h" });
    const uid = user.id;
    const role = user.role;
    const name = user.name;
    const signedUser = jwt.sign({ uid, role, name, email }, secret, { expiresIn: "1h" })

    //setting up the cookie 
    await setSession(token, userSession.expiresAt);
    await setUser(signedUser, userSession.expiresAt);

    return successResponse({}, "Login success", 200);

}
