import { prisma } from "@/lib/prismaHelper"
import { errorResponse } from "./responseHandler";

//get all producs 
export const getAllProducts = async (): Promise<object> => {
    const products = await prisma.product.findMany({});
    return products || []
}


// get a single product 
export const getProduct = async (id: string) => {
    return prisma.product.findUnique({
        where: {
            id
        }
    })

}