import { prisma } from "@/lib/prismaHelper";
import { ObjectId } from "bson";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "../../checkPermission";
import { Role } from "@prisma/client";

export const GET = async (request: NextRequest) => {
    const valid = await checkPermission(Role.ADMIN, "GET_SESSION");

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
    const valid = await checkPermission(Role.ADMIN, "DELETE_SESSION");

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
        message: "Session deleted successfully",
        data: result
    })
}

