'use client';

import { CheckCircle, CalendarDays, Smartphone, Zap } from "lucide-react";


interface TrustSignalsProps {
    dictionary: {
        freeCancellation: string;
        instantConfirmation: string;
        mobileTicket: string;
    };
}

export function TrustSignals({ dictionary }: TrustSignalsProps) {
    return (
        <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <CheckCircle className="w-4 h-4" />
                <span>{dictionary.freeCancellation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                <Zap className="w-4 h-4" />
                <span>{dictionary.instantConfirmation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                <Smartphone className="w-4 h-4" />
                <span>{dictionary.mobileTicket}</span>
            </div>
        </div>
    );
}

