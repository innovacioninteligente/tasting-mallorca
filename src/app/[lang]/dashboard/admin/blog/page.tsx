
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { BlogPostList } from "./blog-post-list";
import { findAllBlogPosts } from "@/app/server-actions/blog/findBlogPosts";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { CreateWithAiButton } from "./create-with-ai-button";

export default async function BlogManagementPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const createPostLink = `/${lang}/dashboard/admin/blog/new`;
    const result = await findAllBlogPosts({});

    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Blog</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los posts del blog.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CreateWithAiButton lang={lang} />
                    <Button asChild>
                        <Link href={createPostLink}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Nuevo Post
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Posts Existentes</CardTitle>
                    <CardDescription>
                        Aquí puedes ver y gestionar todos los posts del blog.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogPostList posts={result.data as BlogPost[]} error={result.error} lang={lang} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
