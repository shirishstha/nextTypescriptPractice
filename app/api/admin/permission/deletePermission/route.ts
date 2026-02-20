import { prisma } from "@/lib/prismaHelper";
import { errorResponse, successResponse } from "../../../responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/app/api/checkPermission";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const DELETE = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return errorResponse("Failed to fetch error");
        }
        const valid = await checkPermission(user.role, "DELETE_PERMISSION");
        //if the validation fails
        if (valid !== null) {
            return valid
        }

        const { rolePermissionId } = (await request.json()) as { rolePermissionId: string };
        if (!rolePermissionId) {
            return errorResponse("Couldnot get role permission id", 404);
        }
        //check if the role and permission association is available
        const exists = await prisma.rolePermission.findUnique({
            where: {
                id: rolePermissionId
            }
        })
        if (!exists) {
            return errorResponse("The entered combination doesnot exist");
        }
        const deletedPermission = await prisma.rolePermission.delete({
            where: {
                id: rolePermissionId
            }
        })
        if (!deletedPermission) {
            return errorResponse("Permission couldnot be deleted");
        }
        return successResponse(deletedPermission, "Permission deleted Successfully", 200);
    } catch (error) {
        console.log(error);
        return errorResponse("Intrnal server error couldnot delete permission.");
    }
}