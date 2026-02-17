import { prisma } from "@/lib/prismaHelper";
import { ObjectId } from "bson";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { adminWithSessionCheck } from "../adminWIthSessionCheck";

export const GET = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const valid = await adminWithSessionCheck(pathname);

    //if the validation fails
    if (valid !== null) {
        return valid
    }

    const uid = request.nextUrl.searchParams.get("uid");
    if (!uid || !ObjectId.isValid(uid)) {
        return NextResponse.json({
            success: false,
            message: "The provided uid is incorrect"
        }, { status: 403 })
    }
    if (!uid) {
        return NextResponse.json({
            success: false,
            message: "couldnot find the uid "
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: uid
            },
            include: {
                sessions: true
            }
        })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "There are no user with that particular id"
            })
        }

        return NextResponse.json({
            success: true,
            message: "User session fetch success",
            user
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "something wrong",

        }, { status: 500 })
    }

}

export const DELETE = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const valid = await adminWithSessionCheck(pathname);

    //if the validation fails
    if (valid !== null) {
        return valid
    }

    const sid = request.nextUrl.searchParams.get('sid');
    //if there is no session id 
    if (!sid) {
        return NextResponse.json({
            success: false,
            message: "Cannot get session id"
        })
    }

    //deleting session id from database
    const result = await prisma.session.delete({
        where: {
            id: sid
        }
    })

    return NextResponse.json({
        success: true,
        message: "Session deleted successfully"
    })
}

