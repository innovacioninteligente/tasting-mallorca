
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AlternateLinksContextType = {
  alternateLinks: { [key: string]: string };
  setAlternateLinks: (links: { [key: string]: string }) => void;
};

const AlternateLinksContext = createContext<AlternateLinksContextType | undefined>(undefined);

export function AlternateLinksProvider({ children }: { children: ReactNode }) {
  const [alternateLinks, setAlternateLinks] = useState<{ [key: string]: string }>({});

  return (
    <AlternateLinksContext.Provider value={{ alternateLinks, setAlternateLinks }}>
      {children}
    </AlternateLinksContext.Provider>
  );
}

export function useAlternateLinks() {
  const context = useContext(AlternateLinksContext);
  if (context === undefined) {
    throw new Error('useAlternateLinks must be used within an AlternateLinksProvider');
  }
  return context;
}
