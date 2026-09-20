import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ProductsRedirect() {
  redirect('/admin/home-page?tab=products');
}
