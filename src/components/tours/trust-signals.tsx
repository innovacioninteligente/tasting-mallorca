
import { ShieldCheck, Truck, Ticket } from 'lucide-react';

export function TrustSignals() {
    return (
        <div className="flex flex-row justify-around items-start gap-4 py-6 border-b border-border/50">
            <div className="flex flex-col items-center text-center gap-2 max-w-[100px]">
                <div className="p-2 rounded-full bg-green-50 text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">Free Cancellation</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2 max-w-[100px]">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <Ticket className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">Mobile Tickets</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2 max-w-[100px]">
                <div className="p-2 rounded-full bg-orange-50 text-orange-600">
                    <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">Hotel Pickup</span>
            </div>
        </div>
    );
}
