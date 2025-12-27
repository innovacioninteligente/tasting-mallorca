'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { runHotelMigration } from "@/app/server-actions/admin/runHotelMigration";
import { useToast } from "@/hooks/use-toast";

export default function MigrationPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; updatedCount?: number; error?: string } | null>(null);

    const handleRunMigration = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const res = await runHotelMigration({});
            if (res.error) {
                setResult({ success: false, error: res.error });
                toast({
                    variant: "destructive",
                    title: "Migration Failed",
                    description: res.error,
                });
            } else if (res.data) {
                setResult({ success: true, updatedCount: res.data.updatedCount });
                toast({
                    title: "Migration Successful",
                    description: `Updated ${res.data.updatedCount} hotels.`,
                });
            }
        } catch (error: any) {
            setResult({ success: false, error: error.message || "An unexpected error occurred." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">System Tools</h1>
                <p className="text-muted-foreground">Advanced system operations and maintenance scripts.</p>
            </div>

            <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <CardTitle>Region-Aware Meeting Point Migration</CardTitle>
                    </div>
                    <CardDescription>
                        This script recalculates and assigns the closest meeting points for ALL regions (North, South, East, West, Central) to every hotel in the database.
                        <br />
                        <strong>Use this when:</strong> You have added new meeting points or changed hotel coordinates and need to update all assignments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Alert variant="default" className="bg-white">
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>
                                This operation scans all hotels and meeting points. It is safe to run on production but may take a few seconds.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleRunMigration}
                                disabled={isLoading}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Run Migration Script
                            </Button>

                            {result?.success && (
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Success! Updated {result.updatedCount} hotels.</span>
                                </div>
                            )}
                        </div>

                        {result?.error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{result.error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
