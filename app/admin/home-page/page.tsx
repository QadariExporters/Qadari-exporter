'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Info,
  Layers,
  ShoppingBag,
  Cpu,
  Image as ImageIcon,
  Home,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroManager } from '@/components/admin/sections/HeroManager';
import { AboutManager } from '@/components/admin/sections/AboutManager';
import { CollectionsManager } from '@/components/admin/sections/CollectionsManager';
import { ProductsManager } from '@/components/admin/sections/ProductsManager';
import { ProcessManager } from '@/components/admin/sections/ProcessManager';
import { GalleryManager } from '@/components/admin/sections/GalleryManager';

const TAB_OPTIONS = [
  { id: 'hero', label: 'Hero Section', icon: Sparkles, desc: 'Top banners & CTA' },
  { id: 'about', label: 'About Qadri Exporters', icon: Info, desc: 'Brand story & photo' },
  { id: 'collections', label: 'Our Collection', icon: Layers, desc: 'Category cards' },
  { id: 'products', label: 'Our Products', icon: ShoppingBag, desc: 'Featured pieces' },
  { id: 'process', label: 'The Process', icon: Cpu, desc: 'Craftsmanship steps' },
  { id: 'gallery', label: 'Editorial Gallery', icon: ImageIcon, desc: 'Visual archive' },
];

function HomePageCMSContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'hero';
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TAB_OPTIONS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/admin/home-page?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-stone-900 text-[#dbc7af] shadow-md">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Home Page CMS Manager</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage all 6 sections of the public Home Page in real-time from a single unified hub.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Database Connected</span>
        </div>
      </div>

      {/* Tab Navigation Hub */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-xs overflow-x-auto">
          <TabsList className="bg-stone-100/80 p-1 rounded-lg w-full flex items-center justify-start sm:justify-between min-w-[700px] h-auto gap-1">
            {TAB_OPTIONS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 py-2.5 px-3 rounded-md text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm text-stone-600 hover:text-stone-900 transition-all flex items-center justify-center gap-2"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab 1: Hero Section */}
        <TabsContent value="hero" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <HeroManager />
        </TabsContent>

        {/* Tab 2: About Qadri Exporters */}
        <TabsContent value="about" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <AboutManager />
        </TabsContent>

        {/* Tab 3: Our Collection */}
        <TabsContent value="collections" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <CollectionsManager />
        </TabsContent>

        {/* Tab 4: Our Products */}
        <TabsContent value="products" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ProductsManager />
        </TabsContent>

        {/* Tab 5: The Process */}
        <TabsContent value="process" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ProcessManager />
        </TabsContent>

        {/* Tab 6: Editorial Gallery */}
        <TabsContent value="gallery" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <GalleryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function HomePageCMSPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
          <p className="text-sm">Loading Home Page CMS...</p>
        </div>
      }
    >
      <HomePageCMSContent />
    </Suspense>
  );
}
