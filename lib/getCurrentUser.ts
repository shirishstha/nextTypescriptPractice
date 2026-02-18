import { errorResponse } from "@/app/api/responseHandler";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("user")?.value;

    if (!userToken) {
        console.log("Couldnot find user token");
        return null
    }
    try {
        const secret = process.env.JWTKEY;

        if (!secret) {
            console.log("Couldnot find secret");
            return null
        }

        const verifiedUser = jwt.verify(JSON.parse(userToken), secret);

        if (!verifiedUser || typeof verifiedUser === "string") {
            console.log("Verification failed");
            return null
        }
        return verifiedUser
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            console.log("Web Token Error");
            return null
        }
        if (error instanceof TokenExpiredError) {
            console.log("Token expired Error");
            return null
        }

    }

}