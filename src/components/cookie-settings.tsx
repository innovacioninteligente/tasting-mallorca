'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useDictionary } from '@/hooks/use-dictionary';
import { COOKIE_CONSENT_KEY } from './analytics-provider';

interface CookieSettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: () => void;
}

export function CookieSettingsDialog({ isOpen, setIsOpen, onSave }: CookieSettingsDialogProps) {
  const dictionary = useDictionary(); // A small custom hook to get dictionary easily client-side
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (isOpen) {
        try {
            const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (stored) {
                const prefs = JSON.parse(stored);
                setAnalytics(prefs.analytics);
                setMarketing(prefs.marketing);
            }
        } catch (error) {
             console.error('Could not access localStorage for cookie consent.');
        }
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
        const consent = { 
            necessary: true, 
            analytics, 
            marketing, 
            timestamp: new Date().toISOString() 
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        window.dispatchEvent(new Event('storage'));
        onSave();
    } catch (error) {
        console.error('Could not save cookie preferences to localStorage.');
    } finally {
        setIsOpen(false);
    }
  };

  const t = dictionary?.cookieSettings;

  if (!t) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-secondary/50">
            <Label htmlFor="necessary" className="flex flex-col gap-1">
              <span className="font-semibold">{t.necessary.title}</span>
              <span className="font-normal text-xs text-muted-foreground">{t.necessary.description}</span>
            </Label>
            <Switch id="necessary" checked disabled />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <Label htmlFor="analytics" className="flex flex-col gap-1">
               <span className="font-semibold">{t.analytics.title}</span>
               <span className="font-normal text-xs text-muted-foreground">{t.analytics.description}</span>
            </Label>
            <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <Label htmlFor="marketing" className="flex flex-col gap-1">
               <span className="font-semibold">{t.marketing.title}</span>
               <span className="font-normal text-xs text-muted-foreground">{t.marketing.description}</span>
            </Label>
            <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            {t.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
