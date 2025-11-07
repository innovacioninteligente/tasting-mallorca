

'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TourManagementPage() {
    const pathname = usePathname();
    const createTourLink = `${pathname}/new`;

    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Tour Management</h1>
                    <p className="text-muted-foreground">
                        Create, edit, and manage all tours for the platform.
                    </p>
                </div>
                <Button asChild>
                    <Link href={createTourLink}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Tour
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Tours</CardTitle>
                     <CardDescription>
                        Here you can view and manage all existing tours.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">No tours created yet.</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click the button above to create your first tour.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
