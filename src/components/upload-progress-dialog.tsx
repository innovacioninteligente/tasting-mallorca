
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface UploadProgressDialogProps {
  progress: number;
  message: string;
}

export function UploadProgressDialog({ progress, message }: UploadProgressDialogProps) {
  return (
    <Dialog open={true}>
      <DialogContent 
        className="max-w-md bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl"
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3 text-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Guardando Tour...</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          <Progress value={progress} />
          <p className="text-center text-sm text-muted-foreground">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
