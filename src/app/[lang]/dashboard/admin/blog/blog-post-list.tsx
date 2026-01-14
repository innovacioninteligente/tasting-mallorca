
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { format } from "date-fns";

interface BlogPostListProps {
    posts?: BlogPost[];
    error?: string;
    lang: string;
}

export function BlogPostList({ posts, error, lang }: BlogPostListProps) {
    const pathname = usePathname();

    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Aún no se han creado posts.</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Haz clic en el botón de arriba para crear tu primer post.
                </p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Publicación</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.map((post) => {

                    console.log('BLOG POST', post)

                    return (

                        <TableRow key={post.id}>
                            <TableCell>
                                <TableCell>
                                    <ImageWithSkeleton
                                        src={post.mainImage}
                                        alt={post.title.en}
                                        width={64}
                                        height={64}
                                        className="rounded-md object-cover aspect-square"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{post.title.en}</TableCell>
                                <TableCell>
                                    <Badge variant={post.published ? 'default' : 'secondary'}>
                                        {post.published ? 'Publicado' : 'Borrador'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(post.publishedAt), "PPP")}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`${pathname}/${post.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" size="sm" disabled={!post.published}>
                                            <Link href={`/${lang}/blog/${post.slug.en}`} target="_blank">
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                        </TableRow>

                    )
                })}
            </TableBody>
        </Table>
    );
}
