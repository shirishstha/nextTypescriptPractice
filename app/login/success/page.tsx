
import { cookies } from "next/headers"
import SuccessClient from "./successClient";

export default async function Success() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("user")?.value!;
     type User = {
        id: string
        name: string,
        email: string,
        isAdmin: boolean
    }
    const user:User = JSON.parse(cookieValue);
   

    return <SuccessClient user= {user}/>
}