
'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export function BlogPostBody({ content }: { content: string }) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-full">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl font-extrabold mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                    p: ({node, ...props}) => <p className="leading-relaxed mb-6" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-8 space-y-2 mb-6" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-8 space-y-2 mb-6" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
