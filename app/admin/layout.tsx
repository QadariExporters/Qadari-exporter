'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Toaster } from 'sonner';

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, don't show admin sidebar/header shell
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col justify-center">
        {children}
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
