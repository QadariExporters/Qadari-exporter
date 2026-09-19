import { redirect } from 'next/navigation';

export default function ProductsRedirect() {
  redirect('/admin/home-page?tab=products');
}
