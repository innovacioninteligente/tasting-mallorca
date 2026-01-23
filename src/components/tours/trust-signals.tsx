
import { ShieldCheck, Truck, Ticket, Utensils } from 'lucide-react';

interface TrustSignalsProps {
    dictionary: {
        freeCancellation: string;
        mobileTicket: string;
        hotelPickup: string;
        allInclusive: string;
    };
}

export function TrustSignals({ dictionary }: TrustSignalsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-border/50">
            <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 rounded-full bg-green-50 text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">{dictionary.freeCancellation}</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <Ticket className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">{dictionary.mobileTicket}</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 rounded-full bg-orange-50 text-orange-600">
                    <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">{dictionary.hotelPickup}</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 rounded-full bg-purple-50 text-purple-600">
                    <Utensils className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight hidden md:block">{dictionary.allInclusive}</span>
                <span className="text-xs font-medium text-muted-foreground leading-tight md:hidden" dangerouslySetInnerHTML={{ __html: dictionary.allInclusive.replace(/: /g, ':<br/>') }} />
            </div>
        </div>
    );
}
