
'use client';

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ImageUpload } from "@/app/[lang]/dashboard/admin/tours/new/image-upload";
import { useState } from "react";

export function getFieldTab(fieldName: string): string {
    if (fieldName.startsWith('title.de') || fieldName.startsWith('content.fr') || fieldName.startsWith('slug.de') || fieldName.startsWith('summary.nl')) {
        return 'translations';
    }
    return 'main';
}

export function BlogForm() {
    const form = useFormContext();
    const [activeTab, setActiveTab] = useState('main');
    const [errorTab, setErrorTab] = useState<string | null>(null);

    const langTabs = [
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'nl', name: 'Nederlands' },
    ];

    return (
        <div className="space-y-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full md:grid md:w-full md:grid-cols-2 flex justify-start overflow-x-auto">
                    <TabsTrigger value="main" className={cn(errorTab === 'main' && 'border-destructive border animate-pulse')}>Content & Images</TabsTrigger>
                    <TabsTrigger value="translations" className={cn(errorTab === 'translations' && 'border-destructive border animate-pulse')}>Translations</TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Main Content (English)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title.en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Post Title</FormLabel>
                                        <FormControl><Input placeholder="e.g., The Hidden Gems of Mallorca's East Coast" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug.en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug (URL-friendly)</FormLabel>
                                        <FormControl><Input placeholder="e-g-hidden-gems-mallorca-east-coast" {...field} /></FormControl>
                                        <FormDescription>This will be part of the URL. Use lowercase letters, numbers, and hyphens only.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="publishedAt"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Publication Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="summary.en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Summary (for cards)</FormLabel>
                                        <FormControl><Textarea rows={3} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content.en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Content (Markdown supported)</FormLabel>
                                        <FormControl><Textarea rows={15} {...field} /></FormControl>
                                        <FormDescription>Use Markdown for formatting (e.g., # Header, *bold*).</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Post Image & Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <FormField
                                control={form.control}
                                name="mainImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Image</FormLabel>
                                        <FormDescription>This image will be displayed at the top of the post and on cards.</FormDescription>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value ? [field.value] : []}
                                                onChange={(file) => field.onChange(file)}
                                                onRemove={() => field.onChange(undefined)}
                                                multiple={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Featured Post</FormLabel>
                                            <FormDescription>Check if this post should appear on the homepage.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="translations" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Translations</CardTitle>
                            <CardDescription>Review and edit the AI-generated translations for each language.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="de" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    {langTabs.map(lang => <TabsTrigger key={lang.code} value={lang.code}>{lang.name}</TabsTrigger>)}
                                </TabsList>
                                {langTabs.map(lang => (
                                    <TabsContent key={lang.code} value={lang.code} className="mt-4 space-y-6">
                                        <Card className="bg-secondary/50">
                                            <CardHeader><CardTitle className="text-lg">Content for {lang.name}</CardTitle></CardHeader>
                                            <CardContent className="space-y-4">
                                                <FormField control={form.control} name={`title.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => (<FormItem> <FormLabel>Title ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                                                <FormField control={form.control} name={`slug.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => (<FormItem> <FormLabel>Slug ({lang.code.toUpperCase()})</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                                                <FormField control={form.control} name={`summary.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => (<FormItem> <FormLabel>Summary ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={3} {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                                                <FormField control={form.control} name={`content.${lang.code as 'de' | 'fr' | 'nl'}`} render={({ field }) => (<FormItem> <FormLabel>Full Content ({lang.code.toUpperCase()})</FormLabel> <FormControl><Textarea rows={15} {...field} /></FormControl> <FormMessage /> </FormItem>)} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
