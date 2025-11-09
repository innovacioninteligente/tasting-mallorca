
'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export function WhatsAppButton() {
    return (
        <Button asChild
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20b356] shadow-lg z-50"
        >
            <Link href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <MessageCircle className="h-8 w-8 text-white fill-white" />
            </Link>
        </Button>
    );
}
