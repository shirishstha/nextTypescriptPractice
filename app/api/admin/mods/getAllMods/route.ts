import { getAllProducts } from "@/app/api/getProduct";
import { successResponse } from "@/app/api/responseHandler";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    const products = await getAllProducts();
    return successResponse(products, "all products fetched successfully");
} 