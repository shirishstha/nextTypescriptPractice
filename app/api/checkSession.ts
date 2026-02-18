import { prisma } from "@/lib/prismaHelper";
import { cookies } from "next/headers";
import { errorResponse } from "./responseHandler";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"

export const checkSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    // checking if there is a session id
    if (!token) {
        return errorResponse("No token found", 400);
    }
    //decoding the session id with jwt
    try {
        const secret = process.env.JWTKEY;
        if (!secret) {
            return errorResponse("Cannot find the secret", 404)
        }
        const verifiedToken = jwt.verify(token, secret);

        if (!verifiedToken || typeof verifiedToken === "string") {
            return errorResponse("Failed to verify the token", 400)
        }
        const sid = verifiedToken?.sid;

        //checking if the session is present on the database
        const dbSession = await prisma.session.findUnique({
            where: {
                id: sid
            }
        })

        //if session is expired or not found
        if (!dbSession || dbSession.expiresAt < new Date()) {
            return errorResponse("Session expired", 400)
        }
        return null

    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return errorResponse("Invalid token")
        }
        if (error instanceof TokenExpiredError) {
            return errorResponse("Your session has expired")

        }
    }
}