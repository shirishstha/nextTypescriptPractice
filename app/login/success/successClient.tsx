"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default  function SuccessClient(user: {email: string}) {
    async function logOut(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const res = await fetch("/api/logout", {
            method: "POST",
        })
        redirect("/login");
    }
    return (
        <div className="bg-white  h-screen text-black flex flex-col items-center justify-center">
            <h1>Login Success.</h1>
            <h1>Welcome {(user.email).split("@")[0]}</h1>
            <Button onClick={(e) => logOut(e)} className="w-full max-w-70 m-4 hover:text-white hover:bg-red-500 bg-red-600 text-white hover:cursor-pointer" variant={"outline"}>Logout</Button>
        </div>
    )
}