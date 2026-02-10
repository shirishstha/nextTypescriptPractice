import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setSession } from "@/lib/session";

export const POST = async (request: NextRequest) => {
    const { email, password } = (await request.json()) as { email: string, password: string };
    const cookieStore = await cookies();
    const jwtKey = process.env.JWTKEY || "";
    const token = jwt.sign({email}, jwtKey, { expiresIn: '1h' });

    const loginFailed = login(email, password);
    if(loginFailed){
        return loginFailed;
    }

    cookieStore.set("token", token, {
        maxAge: 60 * 60 * 24
    })
    const user = {
        id: "100",
        email: email
    }
    setSession(user);

    return NextResponse.json({
        success: true,
        message: "Login success",
    })
}

function login(email: string, password: string) {

    const dbEmail = "demo@gmail.com";
    const dbPassword = "pass";
    if (!email || !password) {
        console.log("Didnot receive credintials properly.");
        return NextResponse.json({
            success: false,
            message: "Didnot receive data properly",
        },{status:403})
    }
    if (email !== dbEmail || password !== dbPassword) {
        console.log("Email and password didnot matched.");
        return NextResponse.json({
            success: false,
            message: "Email and password doesnot matched",
        },{status:401})
    }
    return null
}