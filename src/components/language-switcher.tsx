
"use client"

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { type Locale } from '@/dictionaries/config';
import { useState, useEffect } from 'react';
import { useAlternateLinks } from '@/context/alternate-links-context';

type Language = {
  code: Locale;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];


export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const { alternateLinks } = useAlternateLinks();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages.find(l => l.code === currentLocale) || languages[0]
  );
  
  useEffect(() => {
    const lang = languages.find(l => l.code === currentLocale) || languages[0];
    setSelectedLanguage(lang);
  }, [currentLocale]);


  const handleLanguageChange = (newLang: Language) => {
    const newLocale = newLang.code;

    // Use alternate link if available for the selected locale
    if (alternateLinks[newLocale]) {
      router.push(alternateLinks[newLocale]);
      return;
    }

    // Fallback for non-dynamic pages
    const newPathName = pathname.replace(`/${currentLocale}`, '');
    const newPath = `/${newLocale}${newPathName || '/'}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-base px-2">
          <Globe className="h-5 w-5" />
          <span>{selectedLanguage.flag}</span>
          <span className='hidden sm:inline'>{selectedLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-5 w-5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleLanguageChange(lang)}
            className="flex items-center gap-3 text-lg cursor-pointer"
          >
            <span className="w-6">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
