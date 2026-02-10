import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { setSession } from "./lib/session";

export default async function auth(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const protectedPath = ["/about", "/products", "/login/success"];
    if (protectedPath.some(path => pathname.startsWith(path))) {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No token found"
            })
        }
        try {
             jwt.verify(token, process.env.JWTKEY!);

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return NextResponse.json({
                    success: false,
                    message: "Token Expired",
                }, { status: 401 })
            }
            if (error instanceof JsonWebTokenError) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid token received",
                }, { status: 403 })
            }
        }


        return NextResponse.next()
    }


}

export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
    ],
    runtime: "nodejs",
};