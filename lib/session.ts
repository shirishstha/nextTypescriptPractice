import { cookies } from "next/headers"

const User = {
    id: "string",
    email: "string",
}


//set cookies for session
export const setSession = async (user: typeof User) => {
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(user), {
        httpOnly: false,
        maxAge: 60 * 60
    });
}

// get cookies for session
export const getSession = async () => {
    const cookieStore = await cookies();
    const data = cookieStore.get("session")?.value;
    if (!data) return null;
    return JSON.parse(data);
}

//delete cookies for session
export const deleteSession = async () => {
    const cookieStore = await cookies();
    if (cookieStore.get("session") !== null) {
        cookieStore.delete("session");
    }else{
        console.log("Cannot delete cookie")
    }

}