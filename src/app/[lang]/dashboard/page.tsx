import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: { lang: string }}) {
  redirect(`/${params.lang}/dashboard/overview`);
}
