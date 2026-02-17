import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { prisma } from "@/lib/prismaHelper";

export const adminWithSessionCheck = async (pathname: string) => {
    const adminPath = ["/api/admin", "/admin", "/api/product"]
    if (adminPath.some(path => pathname.startsWith(path))) {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        // checking if there is a session id
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No session found or invalid session"
            }, { status: 401 })
        }
        //decoding the session id with jwt
        try {
            const secret = process.env.JWTKEY;
            if (!secret) {
                return NextResponse.json({
                    success: false,
                    message: "Cannot find the secret"
                })
            }
            const verifiedToken = jwt.verify(token, secret);

            if (!verifiedToken || typeof verifiedToken === "string") {
                return NextResponse.json({
                    success: false,
                    message: "Failed to decode the token"
                })
            }
            const sid = verifiedToken?.sid;

            //checking if the session is present on the database
            const dbSession = await prisma.session.findUnique({
                where: {
                    id: sid
                }
            })

            //if session is expired or not found
            if (!dbSession) {
                return NextResponse.json({
                    success: false,
                    message: "Session Expired"
                })
            }


            //admin validation
            const uid = dbSession.userId;
            const user = await prisma.user.findUnique({
                where: {
                    id: uid
                }
            });
            const isAdmin = user?.isAdmin;
            if (!isAdmin) {
                return NextResponse.json({
                    success: false,
                    message: "Only admin can access this route"
                }, { status: 401 })
            }
            return null

        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid session"
                })
            }
            if (error instanceof TokenExpiredError) {
                return NextResponse.json({
                    success: false,
                    message: "Your session has expired"
                })
            }
        }
    }

}