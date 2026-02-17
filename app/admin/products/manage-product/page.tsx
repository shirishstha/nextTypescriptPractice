"use client"
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function manageProduct() {
    const [products, setProducts] = useState([]);
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


    async function deleteProduct(id: string) {
        try {
            const res = await fetch(`/api/admin/product?id=${id}`, {
                method: "DELETE",
            });
            const { response } = await res.json();
            if (!response.success) {
                toast.error(response.message);
            } else {
                toast.success(response.message);
                fetchProduct();
            }

        } catch (error) {
            console.log(error)
        }
    }
    type product = {
        name: string,
        price: number,
        description: string
        id: string
        stock: number
    }

    return (
        <main className="flex p-4 flex-wrap ">
            {products && products.map((product: product) => {
                return (
                    <Card className="relative mx-auto w-full max-w-sm mt-4 pt-0 hover:scale-102 transition-all ease-in-out" key={product.id}>
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
                        <CardFooter className="flex space-x-2" >
                            <Button className="w-1/2 hover:bg-black/70" asChild><Link href={`/admin/products/update-product?id=${product.id}`}>Edit</Link></Button>
                            <Button className="w-1/2 bg-red-500 hover:bg-red-400" onClick={() => { deleteProduct(product.id) }}>Delete</Button>
                        </CardFooter>
                    </Card>
                )
            })}

        </main>
    )
}