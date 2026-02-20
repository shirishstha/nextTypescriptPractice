"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { LoginInput, loginSchema } from "@/lib/validations/auth.schema"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function LoginForm() {

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginInput) => {
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(data)
        })

        const { response } = await res.json();

        if (response?.success) {
            toast.success(response.message);
            redirect("/login/success");
        } else {
            toast.error(response.message);
        };


    }
    return (
        <div className="mx-auto max-w-120">
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input {...form.register("email")} />
                                    {form.formState.errors.email &&
                                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                                    }
                                </Field>
                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password" >Password</FieldLabel>
                                    </div>
                                    <Input {...form.register("password")} />
                                    {form.formState.errors.password &&
                                        <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                                    }
                                </Field>
                                <Field>
                                    <Button type="submit" className="hover:cursor-pointer">Login</Button>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
