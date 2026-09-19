'use client';

import React, { Suspense } from 'react';
import { Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { GalleryPageManager } from '@/components/admin/sections/GalleryPageManager';

export default function AdminGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
          <p className="text-sm">Loading Gallery Manager...</p>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Page Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-stone-900 text-[#dbc7af] shadow-md">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Gallery Page CMS</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Curate the public photography archive, categorize images, set hover labels, and manage public visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Public /gallery Live</span>
          </div>
        </div>

        {/* Gallery Manager Section */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <GalleryPageManager />
        </div>
      </div>
    </Suspense>
  );
}
