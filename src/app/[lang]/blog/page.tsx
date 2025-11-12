
import { findAllBlogPosts } from "@/app/server-actions/blog/findBlogPosts";
import { BlogCard } from "@/components/blog-card";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { Locale } from "@/dictionaries/config";
import { Newspaper } from "lucide-react";

export default async function BlogPage({ params }: { params: { lang: Locale }}) {
  const result = await findAllBlogPosts({});
  const posts = (result.data || []).filter(post => post.published) as BlogPost[];

  return (
    <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <Newspaper className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-5xl md:text-6xl font-bold font-headline">Nuestro Blog</h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explora nuestros artículos, historias y consejos sobre Mallorca. Todo lo que necesitas saber para tu próximo viaje.
                </p>
            </div>

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} lang={params.lang} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium text-muted-foreground">Aún no hay artículos disponibles.</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Estamos preparando contenido fascinante. ¡Vuelve pronto!
                    </p>
                </div>
            )}
        </div>
    </div>
  );
}
