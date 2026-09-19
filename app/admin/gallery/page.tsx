import { redirect } from 'next/navigation';

export default function GalleryRedirect() {
  redirect('/admin/home-page?tab=gallery');
}
