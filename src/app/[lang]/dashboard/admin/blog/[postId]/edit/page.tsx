
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findBlogPostById } from "@/app/server-actions/blog/findBlogPosts";
import { notFound } from "next/navigation";
import { EditBlogPostClientPage } from "./edit-blog-post-client-page";
import { BlogPost } from "@/backend/blog/domain/blog.model";

interface EditBlogPostPageProps {
    params: {
        postId: string;
        lang: string;
    }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const result = await findBlogPostById(params.postId);

    if (result.error || !result.data) {
        console.error(result.error);
        return notFound();
    }
    
    const post = result.data as BlogPost;

    return (
        <AdminRouteGuard>
            <EditBlogPostClientPage
                initialData={post} 
                lang={params.lang}
            />
        </AdminRouteGuard>
    );
}

