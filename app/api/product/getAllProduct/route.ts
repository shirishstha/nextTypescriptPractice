import { getCurrentUser } from "@/lib/getCurrentUser";
import { getAllProducts } from "../../getProduct"
import { successResponse } from "../../responseHandler";

export const GET = async () => {
    //calling middleware for data fetching
    const products = await getAllProducts();
    await getCurrentUser();
    return successResponse(products, "all products fetched successfully");

}