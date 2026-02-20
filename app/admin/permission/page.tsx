"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function permission() {
  const [permissions, setPermissions] = useState([]);
  const [permissionsWithRole, setPermissionsWithRole] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [permissionName, setPermissionName] = useState("");

  const getPermissions = async () => {
    //fetch all permission
    const res = await fetch("/api/admin/permission/getAllPermission", {
      method: "GET"
    })
    const { response } = await res.json();
    if (!response?.success) {
      return toast.error(response.message);
    }
    setPermissions(response?.data);

  }


  const getPermissionsWithRole = async () => {
    //fetch all permission with role
    const res = await fetch("/api/admin/permission/getAllPermissionWithRole", {
      method: "GET"
    })

    const { response } = await res.json();
    if (!response?.success) {
      return toast.error(response?.message)
    }
    setPermissionsWithRole(response?.data);
  }

  useEffect(() => {
    getPermissions();
    getPermissionsWithRole();
  }, [])

  //create permission function
  const createPermission = async (e: any) => {
    e.preventDefault();
    if (!permissionName) {
      return toast.error("Enter the permission name.")
    }
    const res = await fetch("/api/admin/permission/createPermission", {
      method: "POST",
      body: JSON.stringify({
        permissionName
      })
    })

    const { response } = await res.json();
    if (!response?.success) {
      return toast.error(response.message);
    }
    toast.success(response?.message);
    getPermissions();
    getPermissionsWithRole();
  }

  //assing permission function
  const assignPermission = async (e: any) => {
    e.preventDefault();
    if (!selectedPermission || !selectedRole) {
      return toast.error("Please specify the role and permission");
    }
    const res = await fetch("/api/admin/permission/assignPermission", {
      method: "POST",
      body: JSON.stringify({
        permissionId: selectedPermission,
        role: selectedRole
      })
    })

    const { response } = await res.json();
    if (!response?.success) {
      return toast.error(response.message);
    }
    toast.success(response?.message);
    getPermissionsWithRole();
  }


  //delete permissions
  const deletePermission = async (e: any, id: string) => {
    e.preventDefault();
    const res = await fetch("/api/admin/permission/deletePermission", {
      method: "DELETE",
      body: JSON.stringify({
        rolePermissionId: id,
      })
    })

    const { response } = await res.json();
    if (!response?.success) {
      return toast.error(response.message);
    }
    toast.success(response?.message);
    getPermissionsWithRole();
  }
  return (
    <div className="  grid grid-cols-3 gap-x-7 m-5">
      <div className="col-span-2 gap-y-3">

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Permissions</CardTitle>
              <CardDescription>
                Enter the name of permission
              </CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Input placeholder="Permission name" value={permissionName} required onChange={(e) => setPermissionName(e.target.value)} />
              <Button type="submit" onClick={(e) => createPermission(e)}>Create Permission</Button>

            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Assign Permissions</CardTitle>
              <CardDescription>
                Select role and assign the permission
              </CardDescription>
            </CardHeader>
            <CardContent>

              <div>
                <Select onValueChange={(value) => setSelectedRole(value)}>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles List</SelectLabel>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="MOD">MOD</SelectItem>
                      <SelectItem value="USER">USER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

              </div>

              <div className="mt-4">
                <Select onValueChange={(value) => setSelectedPermission(value)}>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select Permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Permission List</SelectLabel>
                      {permissions && permissions.map((permission: { id: string, name: string }) => (
                        <SelectItem value={permission.id} key={permission?.id}>{permission.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

              </div>
            </CardContent>
            <Button type="submit" onClick={(e) => assignPermission(e)} className="mx-5">Assign Permission</Button>
          </Card>

        </div>

      </div>

      <div className="col-span-1 shadow-lg rounded-lg  p-5">
        <Table>
          <TableCaption>A list of permission assigned to a role.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Role</TableHead>
              <TableHead>Permission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsWithRole.map((rolePermission: { id: string, role: string, permission: { name: string } }) => (
              <TableRow key={rolePermission.id}>
                <TableCell className="font-medium">{rolePermission.role}</TableCell>
                <TableCell>{rolePermission.permission.name}</TableCell>
                <TableCell><Button onClick={(e) => deletePermission(e, rolePermission.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
