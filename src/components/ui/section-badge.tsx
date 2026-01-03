import React from 'react';
import { cn } from '@/lib/utils';

interface SectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}

export function SectionBadge({ children, className, ...props }: SectionBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-cursive font-medium text-xl shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
