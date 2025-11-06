import { redirect } from 'next/navigation';

export default function DashboardPage({ params }: { params: { lang: string }}) {
  redirect(`/${params.lang}/dashboard/overview`);
}
