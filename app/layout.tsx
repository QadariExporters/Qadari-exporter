import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { InquiryProvider } from '@/components/InquiryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://qadriexporters.com'),
  title: 'Qadri Horncraft | Premium Horn Products',
  description: 'Qadri Horncraft offers handcrafted horn products for retail, wholesale and business inquiries.',
  openGraph: {
    title: 'Qadri Horncraft | Premium Horn Products',
    description: 'Natural horn products shaped through craftsmanship for modern markets.',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
        <InquiryProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </InquiryProvider>
      </body>
    </html>
  );
}
