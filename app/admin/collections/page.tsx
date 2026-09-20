import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CollectionsRedirect() {
  redirect('/admin/home-page?tab=collections');
}
