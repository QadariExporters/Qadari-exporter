import { redirect } from 'next/navigation';

export default function AboutRedirect() {
  redirect('/admin/home-page?tab=about');
}
