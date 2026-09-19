import { redirect } from 'next/navigation';

export default function HeroRedirect() {
  redirect('/admin/home-page?tab=hero');
}
