import { redirect } from 'next/navigation';

export default function HomeRedirect({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab || 'hero';
  redirect(`/admin/home-page?tab=${tab}`);
}
