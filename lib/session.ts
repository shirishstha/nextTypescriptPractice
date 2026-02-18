import { cookies } from "next/headers"

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
    return data;
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

//set cookies for users
export const setUser = async (user:string, expiresAt: Date) => {
    const cookieStore = await cookies();
      cookieStore.set("user", JSON.stringify(user), {
        httpOnly: true,
        expires: expiresAt
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