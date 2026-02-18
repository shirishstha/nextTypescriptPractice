import { prisma } from "@/lib/prismaHelper";
import { checkSession } from "./checkSession";
import { Role } from "@prisma/client";
import { errorResponse } from "./responseHandler";


export const checkPermission = async (role: Role, requiredPermission: string) => {

    //validate session
    const valid = await checkSession();
    //if the validation fails
    if (valid !== null) {
        return valid
    }

    //chek if the permission is available
    const permission = await prisma.permission.findUnique({
        where: {
            name: requiredPermission
        },
    })
    if(!permission){
        return errorResponse("There are no such permissions to check",404);
    }

    //check if the current user has that permission
    const hasPermission = await prisma.rolePermission.findFirst({
        where:{
            role,
            permissionId:permission.id
        }
    })
    if (!hasPermission) {
        return errorResponse("This user has no permission to complete this operation", 401);
    }

    return null

}