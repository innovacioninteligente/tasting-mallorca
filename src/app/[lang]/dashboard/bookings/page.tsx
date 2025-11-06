import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardBookingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>You have no bookings yet.</p>
      </CardContent>
    </Card>
  );
}
