
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUsers } from "@/app/server-actions/users/getUsers";
import { User } from "@/backend/users/domain/user.model";
import { UserTable } from "./user-table";


export default async function UserManagementPage() {
    const result = await getUsers({}); // Empty input for now

    return (
        <AdminRouteGuard>
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserTable initialUsers={result.data} error={result.error} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}

