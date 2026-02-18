
import { cookies } from "next/headers"
import SuccessClient from "./successClient";
import { Role } from "@prisma/client";
import isValidObjectId from "@/lib/validateObjectId";

export default async function Success() {
    // const cookieStore = await cookies();
    // const cookieValue = cookieStore.get("user")?.value!;
     type User = {
        id: string
        name: string,
        email: string,
        role: Role
    }

    const user:User = {
        id: "10",
        name: "demo",
        email: "stha@gmail.com",
        role: Role.ADMIN
    }
   

    return <SuccessClient user= {user}/>
}