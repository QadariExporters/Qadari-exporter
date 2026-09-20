import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function HeroRedirect() {
  redirect('/admin/home-page?tab=hero');
}
