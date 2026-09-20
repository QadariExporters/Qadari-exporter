import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ProcessRedirect() {
  redirect('/admin/home-page?tab=process');
}
