
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'tasting-mallorca' | 'teal' | 'ocean' | 'forest' | 'sunset';

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
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (e) {
      // If localStorage is not available, just use the default.
    }
  }, [storageKey]);

  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('theme-tasting-mallorca', 'theme-teal', 'theme-ocean', 'theme-forest', 'theme-sunset');
    
    if (theme) {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        console.error("Could not save theme to localStorage.");
      }
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
