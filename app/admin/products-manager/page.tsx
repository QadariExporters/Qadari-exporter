'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Package, Layers, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FullCatalogManager } from '@/components/admin/sections/FullCatalogManager';
import { CategoriesManager } from '@/components/admin/sections/CategoriesManager';

const TABS = [
  { id: 'products', label: 'Products Catalog', icon: Package, desc: 'Manage all items, gallery & specs' },
  { id: 'categories', label: 'Categories & Collections', icon: Layers, desc: 'Create & manage categories' },
];

function ProductsManagerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'products';
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/admin/products-manager?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-stone-900 text-[#dbc7af] shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Products & Categories Manager</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Add new products category-wise, edit specifications, upload multi-image gallery photos, and create new categories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Catalog & Navigation Synced</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
          <TabsList className="bg-stone-100/80 p-1 rounded-lg w-full flex items-center justify-start h-auto gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 sm:flex-none sm:min-w-[220px] py-2.5 px-4 rounded-md text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm text-stone-600 hover:text-stone-900 transition-all flex items-center justify-center gap-2"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab 1: Full Catalog */}
        <TabsContent value="products" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <FullCatalogManager />
        </TabsContent>

        {/* Tab 2: Categories */}
        <TabsContent value="categories" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <CategoriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProductsManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
          <p className="text-sm">Loading Products Manager...</p>
        </div>
      }
    >
      <ProductsManagerContent />
    </Suspense>
  );
}
