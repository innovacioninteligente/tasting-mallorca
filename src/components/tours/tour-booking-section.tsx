
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign } from "lucide-react";

interface TourBookingSectionProps {
    dictionary: {
        title: string;
        priceLabel: string;
        bookButton: string;
    };
    price: number;
}

export function TourBookingSection({ dictionary, price }: TourBookingSectionProps) {
    return (
        <Card className="sticky top-28 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{dictionary.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-primary" />
                        <span className="text-lg font-semibold">{dictionary.priceLabel}</span>
                    </div>
                    <span className="text-3xl font-extrabold text-primary">${price}</span>
                </div>

                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-muted-foreground">Date</label>
                        <div className="flex items-center gap-3 mt-1 rounded-md border p-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <span>Select a date</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Travelers</label>
                        <div className="flex items-center gap-3 mt-1 rounded-md border p-3">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <span>2 adults</span>
                        </div>
                    </div>
                </div>

                <Button size="lg" className="w-full font-bold text-lg py-7">
                    {dictionary.bookButton}
                </Button>
            </CardContent>
        </Card>
    );
}
