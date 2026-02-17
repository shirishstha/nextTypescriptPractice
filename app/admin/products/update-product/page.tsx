"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function manageProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState("This product is awesome");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    if (!id) {
        return toast.error("Cannot get id");
    }

    async function getProduct() {
        try {
            const res = await fetch(`/api/admin/product?id=${id}`, {
                method: "GET",
            })
            const { response } = await res.json();
            toast(response?.message);
            console.log(response.data.name);
            setName(response.data.name);
            setPrice(response.data.price);
            setStock(response.data.stock);
            setDescription(response.data.description);
        console.log(response);
        } catch (error) {
            console.log(error);
            toast("Error occured");
        }
    }
    useEffect(() => {
      if(id)  getProduct()
    }, [id])

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/product?id=${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name,
                    price,
                    stock,
                    description
                })
            });
            const { response } = await res.json();
            if (!response.success) {
                toast.error("Error Occured", {
                    position: "top-center",
                    description: response.message
                });
            } else {
                toast.success("Product Updated", {
                    position: "top-center",
                    description: response.message
                });
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="p-10 w-1/2">
            <Card className="  ">
                <CardHeader>
                    <CardTitle>Update  Product</CardTitle>
                    <CardDescription>
                        Enter product information below to update  product
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                                <Input id="name" type="text" value={name} placeholder="John Doe" onChange={(e) => setName(e.target.value)} required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                <Input
                                    id="price"
                                    type=""
                                    placeholder="Rs.000"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                                <Input id="stock" type="text" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
                                <FieldDescription>
                                    * Must be greater or equal to 0.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="stock">Description</FieldLabel>
                                <Input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                <FieldDescription>
                                    *  Description can be empty.
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                        <Button type="submit" className="mt-3 w-full">Update Product</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}