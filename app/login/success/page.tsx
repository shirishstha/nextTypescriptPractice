
import { cookies } from "next/headers"
import SuccessClient from "./successClient";

export default async function Success() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("session")?.value!;
    const user = JSON.parse(cookieValue);
   
    return <SuccessClient email={user.email}/>
}