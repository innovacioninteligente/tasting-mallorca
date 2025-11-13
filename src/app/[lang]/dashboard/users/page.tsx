
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getUsers } from "@/app/server-actions/users/getUsers";
import { User } from "@/backend/users/domain/user.model";
import { UserTable } from "./user-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";


export default async function UserManagementPage({ params }: { params: { lang: string }}) {
    const result = await getUsers({});

    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        View all registered users and their roles.
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/${params.lang}/dashboard/admin/create-guide`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create New Guide
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable initialUsers={result.data} error={result.error} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
