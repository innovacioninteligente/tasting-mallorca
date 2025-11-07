
'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/backend/users/domain/user.model";

interface UserTableProps {
    initialUsers?: User[];
    error?: string;
}

export function UserTable({ initialUsers, error }: UserTableProps) {

    if (error) {
        return <p className="text-destructive">Error: {error}</p>;
    }

    if (!initialUsers) {
        return <p>No users found.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>UID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialUsers.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
