import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center flex-col space-y-3">
      <h1 className="text-2xl">Welcome home</h1>
      <Link href="/login"><Button>Go to login</Button></Link>
    </div>
  )
}