'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function WhatsAppButton() {
    const pathname = usePathname();
    const isTourPage = /^\/[a-z]{2}\/tours\/.+/.test(pathname);

    return (
        <Button asChild
            className={cn(
                "fixed right-6 h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20b356] shadow-lg z-40",
                isTourPage ? "bottom-24 md:bottom-6" : "bottom-6"
            )}
        >
            <Link href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <MessageCircle className="h-8 w-8 text-white fill-white" />
            </Link>
        </Button>
    );
}
