"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function createProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState("This product is awesome");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/product", {
                method: "POST",
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
                    description: response.message
                });
            } else {
                toast.success("Product Created", {
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
                    <CardTitle>Create a Product</CardTitle>
                    <CardDescription>
                        Enter product information below to create a new product
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Product Name</FieldLabel>
                                <Input id="name" type="text" placeholder="John Doe" onChange={(e) => setName(e.target.value)} required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                <Input
                                    id="price"
                                    type=""
                                    placeholder="Rs.000"
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                                <Input id="stock" type="text" onChange={(e) => setStock(Number(e.target.value))} required />
                                <FieldDescription>
                                   * Must be greater or equal to 0.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="stock">Description</FieldLabel>
                                <Input id="description" type="text" onChange={(e) => setDescription(e.target.value)} />
                                <FieldDescription>
                                  *  Description can be empty.
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                        <Button type="submit" className="mt-3 w-full">Create Product</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}