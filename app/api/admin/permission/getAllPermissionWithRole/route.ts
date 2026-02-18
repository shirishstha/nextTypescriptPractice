import { prisma } from "@/lib/prismaHelper";
import { errorResponse, successResponse } from "../../../responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/app/api/checkPermission";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user || user == null || user instanceof NextResponse) {
            return user
        }
        const valid = await checkPermission(user.role, "GET_ALL_PERMISSION");
        //if the validation fails
        if (valid !== null) {
            return valid
        }

        const permission = await prisma.rolePermission.findMany({
            include: {
                permission: true
            }
        })
        if (!permission) {
            return errorResponse("Permission with role couldnot be fetched");
        }
        return successResponse(permission, "All Permission with role fetched Successfully", 200);
    } catch (error) {
        console.log(error);
        return errorResponse("Intrnal server error couldnot fetch permission with role.");
    }
}