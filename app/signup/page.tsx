"use client"
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
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupInput, signupSchema } from "@/lib/validations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


export default function SignupForm() {
  const router = useRouter();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });


  async function onSubmit(data: SignupInput) {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data)
      })

      const { response } = await res.json();


      if (!response?.success) {
        throw new Error(response.message)
      }
      toast.success(response.message);
      router.push("/login");

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }

  }
  return (
    <div className="mx-auto max-w-120 ">
      <Card >
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs">* {form.formState.errors.name.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-xs">* {form.formState.errors.email.message}</p>
                  )}
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email
                    with anyone else.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input {...form.register("password")} />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-xs">* {form.formState.errors.password.message}</p>
                  )}
                </Field>

                <FieldGroup>
                  <Field>
                    <Button type="submit">Create Account</Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link href="/login">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>

  )
}
