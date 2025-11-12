
'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { usePathname } from "next/navigation";
import { BlogFormPage } from "../blog-form-page";

export default function NewBlogPostPage() {
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'en';

    return (
        <AdminRouteGuard>
            <BlogFormPage lang={lang} />
        </AdminRouteGuard>
    );
}
