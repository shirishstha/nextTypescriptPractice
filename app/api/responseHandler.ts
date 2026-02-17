import { NextApiResponse } from "next"
import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export const createResponse = <T>(
    success: boolean,
    message: string,
    data?: T,
    status: number = 200
) => {
    const response: ApiResponse<T> = { success, message, data };
    return NextResponse.json({ response }, { status });
};

export const errorResponse = (message: string, status: number = 400) =>
    createResponse(false, message, undefined, status);

export const successResponse = <T>(data: T, message: string, status: number = 200) =>
    createResponse(true, message, data, status);

