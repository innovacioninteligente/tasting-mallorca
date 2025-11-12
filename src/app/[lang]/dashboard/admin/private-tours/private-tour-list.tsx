
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

interface PrivateTourRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    nationality?: string;
    hotel: string;
    preferredDate?: string | null;
    participants: number;
    preferredLanguage?: string;
    visitPreferences?: string[];
    additionalComments?: string;
    submittedAt: string;
}

interface PrivateTourListProps {
    requests?: PrivateTourRequest[];
    error?: string;
}

export function PrivateTourList({ requests, error }: PrivateTourListProps) {
    const [selectedRequest, setSelectedRequest] = useState<PrivateTourRequest | null>(null);

    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">No private tour requests yet.</h3>
            </div>
        );
    }
    
    const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
        value ? (
            <div className="flex flex-col space-y-1 py-3 border-b">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-medium text-base">{value}</dd>
            </div>
        ) : null
    );

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date Submitted</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Preferred Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>{format(new Date(request.submittedAt), 'PPP')}</TableCell>
                            <TableCell className="font-medium">{request.name}</TableCell>
                            <TableCell>{request.email}</TableCell>
                            <TableCell>{request.participants}</TableCell>
                            <TableCell>
                                {request.preferredDate ? format(new Date(request.preferredDate), 'PPP') : 'Not specified'}
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Sheet open={!!selectedRequest} onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
                <SheetContent className="sm:max-w-lg p-0 overflow-y-auto">
                    {selectedRequest && (
                        <>
                            <SheetHeader className="p-6 pb-4">
                                <SheetTitle className="text-2xl">Request from {selectedRequest.name}</SheetTitle>
                                <SheetDescription>
                                    Submitted on {format(new Date(selectedRequest.submittedAt), 'PPP p')}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="px-6 space-y-4">
                                <dl className="divide-y divide-border">
                                    <DetailRow label="Name" value={selectedRequest.name} />
                                    <DetailRow label="Email" value={<a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">{selectedRequest.email}</a>} />
                                    <DetailRow label="Phone" value={selectedRequest.phone || 'Not provided'} />
                                    <DetailRow label="Nationality" value={selectedRequest.nationality || 'Not provided'} />
                                    <DetailRow label="Hotel/Accommodation" value={selectedRequest.hotel} />
                                    <DetailRow label="Participants" value={selectedRequest.participants} />
                                    <DetailRow label="Preferred Date" value={selectedRequest.preferredDate ? format(new Date(selectedRequest.preferredDate), 'PPP') : 'Not specified'} />
                                    <DetailRow label="Preferred Language" value={selectedRequest.preferredLanguage?.toUpperCase() || 'Not specified'} />
                                    <DetailRow 
                                        label="Visit Preferences"
                                        value={
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {selectedRequest.visitPreferences?.length ? selectedRequest.visitPreferences.map(p => <Badge key={p} variant="secondary">{p.replace(/-/g, ' ')}</Badge>) : 'None specified'}
                                            </div>
                                        }
                                    />
                                    <DetailRow label="Additional Comments" value={<p className="whitespace-pre-wrap">{selectedRequest.additionalComments || 'None'}</p>} />
                                </dl>
                            </div>
                            <SheetFooter className="p-6 mt-4">
                                <Button onClick={() => setSelectedRequest(null)}>Close</Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
