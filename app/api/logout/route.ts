import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const cookieStore = await cookies();
    if (cookieStore.get("token") !== null) {
        cookieStore.delete("token");
    } else {
        console.log("Cannot delete cookie")
    }
    await deleteSession();
    return NextResponse.json({
        success: true,
        message: "logout successfull"
    }
    )
}