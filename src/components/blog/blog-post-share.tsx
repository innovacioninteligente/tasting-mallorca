
'use client';

import { Link, Mail, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BlogPostShareProps {
  title: string;
  url: string;
}

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


export function BlogPostShare({ title, url }: BlogPostShareProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'The article link has been copied to your clipboard.',
    });
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`,
  };

  return (
    <div className="sticky top-28 space-y-3">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Share</span>
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full" onClick={handleCopy}>
        <Link className="h-5 w-5" />
      </Button>
      <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
        </a>
      </Button>
      <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
      <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-5 w-5" />
        </a>
      </Button>
      <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <a href={shareLinks.email}>
          <Mail className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
