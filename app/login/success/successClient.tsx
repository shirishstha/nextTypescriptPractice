"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type User = {
    id: string
    name: string,
    email: string,
    isAdmin: boolean
}

type SuccessClientProps = {
    user: User;
};


export default function SuccessClient({ user }: SuccessClientProps) {
    const [products, setProducts] = useState([]);

    //function to logout 
    async function logOut(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const res = await fetch("/api/logout", {
            method: "POST",
        })
        redirect("/login");
    }

    //
    async function fetchProduct() {
        try {
            const res = await fetch("/api/product/getAllProduct", {
                method: "GET"
            });
            const { response } = await res.json();
            const data = response?.data;
            if (!data) {
                console.log("No data recivedd");
            }
            setProducts(data);


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [])

    type product = {
        name: string,
        price: number,
        description: string
        id: string
        stock: number
    }
    return (
        <>
            <nav className="w-full flex justify-between p-5">
                <div className=" ">
                    <h1 className="text-xl font-semibold">Welcome {user.name}</h1>
                    <h2 className="text-sm text-gray-500"> {user.email}</h2>                     
                </div>
                <div className="bg-white text-black  ">
                    <Button onClick={(e) => logOut(e)} className=" border border-red-400 bg-transparent text-red-400 hover:cursor-pointer hover:bg-red-500 hover:text-white" >Logout</Button>
                </div>
            </nav>
            <main className="flex p-4 flex-wrap">
                {products && products.map((product: product) => {
                    return (
                        <Card className="relative mx-auto w-full max-w-sm pt-0 hover:scale-102 transition-all ease-in-out" key={product.id}>
                            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                            <img
                                src="https://avatar.vercel.sh/shadcn1"
                                alt="Event cover"
                                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                            />
                            <CardHeader>
                                <CardAction>
                                    <Badge variant="secondary">{product.stock} items left</Badge>
                                </CardAction>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <h1>Rs. {product.price}</h1>
                                <CardDescription >
                                    {product.description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full hover:cursor-pointer">Buy (feature comming soon)</Button>
                            </CardFooter>
                        </Card>
                    )
                })}

            </main>

        </>

    )
}