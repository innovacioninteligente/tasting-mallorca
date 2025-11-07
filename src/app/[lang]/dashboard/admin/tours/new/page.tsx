
'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "./tour-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewTourPage() {
    const pathname = usePathname();
    const basePath = pathname.split('/').slice(0, -1).join('/');

    return (
        <AdminRouteGuard>
            <div className="mb-6">
                 <Button asChild variant="outline" size="sm">
                    <Link href={basePath}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Tours
                    </Link>
                </Button>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Create a New Tour</h1>
                    <p className="text-muted-foreground">
                        Fill out the form below to add a new tour to the platform.
                    </p>
                </div>
            </div>
            <TourForm />
        </AdminRouteGuard>
    );
}
