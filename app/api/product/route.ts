import { NextRequest } from "next/server"
import { errorResponse, successResponse } from "../responseHandler";
import isValidObjectId from "@/lib/validateObjectId";
import { getProduct } from "../getProduct";

export const GET = async (request: NextRequest) => {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return errorResponse("Id required", 400);
    }
    if (!isValidObjectId(id)) {
        return errorResponse("Invalid product id ", 400);
    }

    // fetch product
    const product = await getProduct(id);

    if (!product) {
        return errorResponse("Could not find the product with that id", 404);
    }

    return successResponse(product, "Product fetched successfully");

}