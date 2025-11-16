import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <ThemeSwitcher />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your account settings here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
