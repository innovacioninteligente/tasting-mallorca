'use client';

import { useState, useEffect } from 'react';
import { getDictionary, DictionaryType } from '@/dictionaries/get-dictionary';
import { usePathname } from 'next/navigation';
import { Locale } from '@/dictionaries/config';

export function useDictionary() {
  const pathname = usePathname();
  const [dictionary, setDictionary] = useState<DictionaryType | null>(null);

  useEffect(() => {
    const lang = (pathname.split('/')[1] || 'en') as Locale;
    getDictionary(lang).then(setDictionary);
  }, [pathname]);

  return dictionary;
}
