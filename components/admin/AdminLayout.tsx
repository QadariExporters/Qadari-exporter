'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Toaster } from 'sonner';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-100/70 overflow-hidden font-sans text-stone-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-r border-zinc-800">
          <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onToggleMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
