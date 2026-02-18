import { prisma } from "@/lib/prismaHelper";
import { errorResponse, successResponse } from "../../../responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/app/api/checkPermission";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const POST = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user || user == null || user instanceof NextResponse) {
            return user
        }
        const valid = await checkPermission(user.role, "CREATE_PERMISSION");
        //if the validation fails
        if (valid !== null) {
            return valid
        }

        const { permissionName } = (await request.json()) as { permissionName: string };
        if (!permissionName) {
            return errorResponse("Couldnot get permission name", 404);
        }
        const pNameUpper = permissionName.toUpperCase();

        //check for duplicated entry
        const exists = await prisma.permission.findUnique({
            where:{
                name:pNameUpper
            }
        })
        if(exists){
            return errorResponse("The entered permission already exists.");
        }
        const permission = await prisma.permission.create({
            data: {
                name: pNameUpper
            }
        })
        if (!permission) {
            return errorResponse("Permission couldnot be created");
        }
        return successResponse(permission, "Permission created Successfully", 201,);
    } catch (error) {
        console.log(error);
        return errorResponse("Intrnal server error couldnot create permission.");
    }
}