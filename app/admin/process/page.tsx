import { redirect } from 'next/navigation';

export default function ProcessRedirect() {
  redirect('/admin/home-page?tab=process');
}
