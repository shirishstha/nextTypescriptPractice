import { cookies } from "next/headers"
import { BlockquoteHTMLAttributes } from "react";


//set cookies for session
export const setSession = async (token: string, expiresAt: Date) => {
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        expires: expiresAt
    });
}

// get cookies for session
export const getSession = async () => {
    const cookieStore = await cookies();
    const data = cookieStore.get("token")?.value;
    if (!data) return null;
    return JSON.parse(data);
}

//delete cookies for session
export const deleteSession = async () => {
    const cookieStore = await cookies();
    if (cookieStore.get("token") !== null) {
        cookieStore.delete("token");
    } else {
        console.log("Cannot delete cookie")
    }

}

type User = {
    id: string,
    name: string,
    email: string,
    isAdmin: boolean
}
//set cookies for users
export const setUser = async (user:User) => {
    const cookieStore = await cookies();
    cookieStore.set("user", JSON.stringify(user), {
        httpOnly: false,
    });
}
//delete cookies for users
export const deleteUser = async () => {
    const cookieStore = await cookies();
     if (cookieStore.get("user") !== null) {
        cookieStore.delete("user");
    } else {
        console.log("Cannot delete cookie")
    }
}