
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

// Add this to Dialog component to allow hiding close button
declare module "@radix-ui/react-dialog" {
    interface DialogContentProps {
        hideCloseButton?: boolean;
    }
}

import { X } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const OriginalDialogContent = DialogPrimitive.Content;

// @ts-ignore
OriginalDialogContent.render = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { hideCloseButton?: boolean }
>(({ className, children, hideCloseButton, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
