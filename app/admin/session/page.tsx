"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
export default function Home() {
    const [userId, setUserId] = useState("");
    const [sessions, setSessions] = useState([]);
    async function getSession() {
        const res = await fetch(`/api/admin/session?uid=${userId}`, {
            method: "GET",
        })

        const data = await res.json();
        if (!data.success) {
            console.log("failed to load sessions");
            toast.error(data.message);
            return
        }
        setSessions(data.user?.sessions);

    }
    async function deleteSession(sid: string) {
        const res = await fetch(`/api/admin/session?sid=${sid}`, {
            method: "DELETE",
        })

        const data = await res.json();
        if (!data.success) {
            return console.log("failed to delete sessions");
        }
        toast(data.message);
        getSession();

    }
    type Session = {
        id: string,
        createdAt: string,
        expiresAt: string,
        userId: string
    }
    return (
        <div className="m-5">
            <h1 className="font-normal text-3xl py-5">Manage Sessions</h1>
            <h2>Enter User Id for fetching sessions</h2>
            <div className="w-xl flex space-x-2">

                <Input className="w-" name="userId" onChange={(e) => setUserId(e.target.value)} />
                <Button onClick={getSession}>Get Sessions</Button>
            </div>



            <Table>
                <TableCaption>A list of Active Sessions</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Session Id</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Expires At</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.length > 0 ? (sessions.map((session: Session) =>
                    (
                        <TableRow key={session?.id}>
                            <TableCell className="font-medium">{session?.id}</TableCell>
                            <TableCell>{session?.createdAt}</TableCell>
                            <TableCell>{session?.expiresAt}</TableCell>
                            <TableCell><Button className="bg-red-500 hover:bg-red-400" onClick={() => deleteSession(session.id)}>Delete Session</Button></TableCell>
                        </TableRow>
                    )
                    )) : (
                        <TableRow>
                            <TableCell className=""></TableCell>
                            <TableCell className=""></TableCell>
                            <TableCell className="">There are no sessions</TableCell>
                            <TableCell className=""></TableCell>

                        </TableRow>

                    )}
                </TableBody>
            </Table>
        </div>
    )
}