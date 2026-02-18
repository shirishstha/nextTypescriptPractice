import { NextRequest } from "next/server"
import { errorResponse, successResponse } from "../../responseHandler";
import { adminWithSessionCheck } from "../../adminWIthSessionCheck";
import { prisma } from "@/lib/prismaHelper";
import isValidObjectId from "@/lib/validateObjectId";

// To create a product
export const POST = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const valid = await adminWithSessionCheck(pathname);

    //if the validation fails
    if (valid !== null) {
        return valid
    }

    const { name, price, stock, description } = (await request.json()) as { name: string; price: number, stock: number, description: string };
    if (!name || !price || stock == null) {
        return errorResponse("Couldnot receive data properly", 400);
    }
    if (stock < 0 || price < 0) {
        return errorResponse("You cannot set the value of stock or price less than 0", 422);
    }
    //creating new product in database
    const result = await prisma.product.create({
        data: {
            name,
            price,
            stock,
            description: description || "This is a good product"
        }
    })
    if (!result) {
        return errorResponse("Operation failed", 500)
    }

    return successResponse({ result }, "Product created successfully", 201);
}

// To update a product
export const PUT = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const valid = await adminWithSessionCheck(pathname);

    //if the validation fails
    if (valid !== null) {
        return valid
    }

    const id = request.nextUrl.searchParams.get("id");

    //validate id
    if (!id) {
        return errorResponse("Id required", 400);
    }

    if (!isValidObjectId(id)) {
        return errorResponse("Invalid product id ", 400);
    }

    const { name, price, stock, description } = (await request.json()) as { name: string, price: number, stock: number, description: string };
    if (!name || !id || !price || stock == null) {
        return errorResponse("Couldnot receive data properly", 400);
    }
    if (stock < 0 || price < 0) {
        return errorResponse("You cannot set the value of stock or price less than 0", 422);
    }

    //check if product exist or not
    const product = await getProduct(id);
    if (!product) {
        return errorResponse("Could not find the product with that id", 404);
    }

    //updating product in database
    const result = await prisma.product.update({
        where: {
            id
        },
        data: {
            name,
            price,
            stock,
            description: description || "This is a good product"
        }
    })
    if (!result) {
        return errorResponse("Operation failed", 500)
    }

    return successResponse({ result }, "Product updated successfully", 200);
}



// To delete a product
export const DELETE = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const valid = await adminWithSessionCheck(pathname);

    //if the validation fails
    if (valid !== null) {
        return valid
    }

    const id = request.nextUrl.searchParams.get("id");

    //validate id
    if (!id) {
        return errorResponse("Id required", 400);
    }

    if (!isValidObjectId(id)) {
        return errorResponse("Invalid product id ", 400);
    }

    //check if product exist or not
    const product = await getProduct(id);
    if (!product) {
        return errorResponse("Could not find the product with that id", 404);
    }

    //delete product in database
    const result = await prisma.product.delete({
        where: {
            id
        }
    })
    if (!result) {
        return errorResponse("Operation failed", 500)
    }

    return successResponse( result , "Product deleted successfully", 200);
}

export const GET = async (request: NextRequest) => {
    const id = request.nextUrl.searchParams.get("id");

    // validate id
    if (!id) {
        return errorResponse("Id required", 400);
    }

    if (!isValidObjectId(id)) {
        return errorResponse("Invalid product id", 400);
    }

    // fetch product
    const product = await getProduct(id);

    if (!product) {
        return errorResponse("Could not find the product with that id", 404);
    }

    return successResponse(product, "Product fetched successfully");
};

