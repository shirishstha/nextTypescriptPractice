import { prisma } from "@/lib/prismaHelper";
import { errorResponse, successResponse } from "../../../responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/app/api/checkPermission";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Role } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if(!user){
            return errorResponse("Couldnot get current user.");
        }
        const valid = await checkPermission(user.role, "ASSIGN_PERMISSION");
        //if the validation fails
        if (valid !== null) {
            return valid
        }

        const { permissionId, role } = (await request.json()) as { permissionId: string, role: Role };
        if (!permissionId) {
            return errorResponse("Couldnot get permission id", 404);
        }
        //checking if permission already exists
        const exists = await prisma.rolePermission.findFirst({
            where: {
                permissionId,
                role
            }
        })

        if (exists) {
            return errorResponse("Permission is already assigned to that role");
        }


        const rolePermission = await prisma.rolePermission.create({
            data: {
                permissionId,
                role
            }, include: {
                permission: true
            }
        })
        if (!rolePermission) {
            return errorResponse("Permission couldnot be assigned");
        }
        return successResponse(rolePermission, "Permission assigned Successfully", 201,);
    } catch (error) {
        console.log(error);
        return errorResponse("Intrnal server error couldnot assign permission.");
    }
}