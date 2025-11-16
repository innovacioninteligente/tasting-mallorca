
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'tasting-mallorca' | 'teal' | 'ocean' | 'desert';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'tasting-mallorca',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'tasting-mallorca',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
      if (typeof window === 'undefined') {
        return defaultTheme;
      }
      return (localStorage.getItem(storageKey) as Theme | null) || defaultTheme;
  });

  useEffect(() => {
    const body = window.document.body;

    body.classList.remove('theme-tasting-mallorca', 'theme-teal', 'theme-ocean', 'theme-desert');

    if (theme) {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
