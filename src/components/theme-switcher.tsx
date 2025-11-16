
'use client';

import { useTheme } from '@/components/theme-provider';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  {
    name: 'tasting-mallorca',
    label: 'Tasting Mallorca (Default)',
    colors: ['hsl(356 90% 32%)', 'hsl(4 85% 46%)', 'hsl(11 50% 96%)'],
  },
  {
    name: 'teal',
    label: 'Deep Teal',
    colors: ['hsl(181 88% 33%)', 'hsl(199 41% 54%)', 'hsl(199 41% 95%)'],
  },
   {
    name: 'ocean',
    label: 'Ocean Blue',
    colors: ['hsl(210 89% 41%)', 'hsl(190 77% 68%)', 'hsl(210 40% 96%)'],
  },
  {
    name: 'desert',
    label: 'Desert Sands',
    colors: ['hsl(24 93% 58%)', 'hsl(37 92% 56%)', 'hsl(38 60% 95%)'],
  },
  {
    name: 'forest',
    label: 'Forest Green',
    colors: ['hsl(161 74% 14%)', 'hsl(147 18% 51%)', 'hsl(43 100% 50%)'],
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Select a color palette for the entire application.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name as any)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all text-left relative",
              theme === t.name ? "border-primary shadow-lg" : "border-muted hover:border-primary/50"
            )}
          >
            {theme === t.name && (
                <div className="absolute top-2 right-2 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              {t.colors.map((color) => (
                <div
                  key={color}
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="font-semibold text-foreground">{t.label}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
