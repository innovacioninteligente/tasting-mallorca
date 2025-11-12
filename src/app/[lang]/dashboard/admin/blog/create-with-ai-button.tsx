
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { generateBlogPostAction } from '@/app/server-actions/blog/generateBlogPostAction';

export function CreateWithAiButton({ lang }: { lang: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleCreate = async () => {
        if (!prompt.trim()) {
            toast({
                variant: 'destructive',
                title: 'Prompt is empty',
                description: 'Please describe the blog post you want to create.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await generateBlogPostAction({ prompt });
            if (result.error) throw new Error(result.error);
            if (!result.data?.postId) throw new Error("Failed to get new post ID.");

            toast({
                title: 'Blog Post Generated!',
                description: 'Redirecting you to the edit page to review and publish.',
            });
            
            router.push(`/${lang}/dashboard/admin/blog/${result.data.postId}/edit`);
            setIsOpen(false);
            setPrompt("");

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error generating post',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Crear con IA
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Crear Post con IA</AlertDialogTitle>
                    <AlertDialogDescription>
                        Describe el tema, los puntos clave o el título que quieres para tu nuevo post. La IA generará un borrador completo en todos los idiomas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="prompt">Tu idea para el post:</Label>
                    <Textarea
                        id="prompt"
                        placeholder="Ej: Un post sobre los 5 pueblos más bonitos de la Sierra de Tramuntana, mencionando por qué son especiales."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generar Post"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
