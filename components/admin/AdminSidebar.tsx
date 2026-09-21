'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Sparkles,
  Info,
  Layers,
  ShoppingBag,
  Cpu,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Package,
  BookOpen,
  Images,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [homeOpen, setHomeOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  const currentTab = searchParams.get('tab') || 'hero';

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };

  const homeSubSections = [
    { label: 'Hero Section', tab: 'hero', icon: Sparkles },
    { label: 'About Qadri Horncraft', tab: 'about', icon: Info },
    { label: 'Our Collection', tab: 'collections', icon: Layers },
    { label: 'HomePage Products', tab: 'products', icon: ShoppingBag },
    { label: 'The Process', tab: 'process', icon: Cpu },
    { label: 'Editorial Gallery', tab: 'gallery', icon: ImageIcon },
  ];

  const isHomeActive = pathname.startsWith('/admin/home');

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col h-full border-r border-zinc-800 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex flex-col tracking-wider font-serif group"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 group-hover:text-white transition-colors">
            QADRI HORNCRAFT
          </span>
          <span className="text-[10px] tracking-[0.3em] text-[#dbc7af] uppercase">
            Admin CMS
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <p className="px-3 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2">
          Management
        </p>

        {/* Dashboard Link */}
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname === '/admin'
              ? 'bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <LayoutDashboard
            className={`w-4 h-4 ${pathname === '/admin' ? 'text-[#dbc7af]' : 'text-zinc-400'}`}
          />
          <span>Dashboard</span>
        </Link>

        {/* Home Page Tab & Sections */}
        <div className="space-y-1">
          <div
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              isHomeActive
                ? 'bg-zinc-850 text-white font-semibold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            onClick={() => {
              setHomeOpen(!homeOpen);
            }}
          >
            <Link
              href="/admin/home-page"
              onClick={onCloseMobile}
              className="flex items-center gap-3 flex-1"
            >
              <Home
                className={`w-4 h-4 ${isHomeActive ? 'text-[#dbc7af]' : 'text-zinc-400'}`}
              />
              <span>Home Page</span>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHomeOpen(!homeOpen);
              }}
              className="p-0.5 text-zinc-500 hover:text-white"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  homeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Sub-tabs under Home Page */}
          {homeOpen && (
            <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-zinc-800 ml-4">
              {homeSubSections.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = isHomeActive && currentTab === sub.tab;

                return (
                  <Link
                    key={sub.tab}
                    href={`/admin/home-page?tab=${sub.tab}`}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isSubActive
                        ? 'bg-zinc-800 text-white font-semibold text-[#dbc7af]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <SubIcon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSubActive ? 'text-[#dbc7af]' : 'text-zinc-500'
                      }`}
                    />
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Products & Categories Standalone Hub */}
        <div className="space-y-1">
          <div
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              pathname.startsWith('/admin/products-manager')
                ? 'bg-zinc-850 text-white font-semibold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            onClick={() => {
              setProductsOpen(!productsOpen);
            }}
          >
            <Link
              href="/admin/products-manager?tab=products"
              onClick={onCloseMobile}
              className="flex items-center gap-3 flex-1"
            >
              <Package
                className={`w-4 h-4 ${
                  pathname.startsWith('/admin/products-manager') ? 'text-[#dbc7af]' : 'text-zinc-400'
                }`}
              />
              <span>Home Page Products</span>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProductsOpen(!productsOpen);
              }}
              className="p-0.5 text-zinc-500 hover:text-white"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  productsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {productsOpen && (
            <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-zinc-800 ml-4">
              <Link
                href="/admin/products-manager?tab=products"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  pathname.startsWith('/admin/products-manager') && currentTab === 'products'
                    ? 'bg-zinc-800 text-white font-semibold text-[#dbc7af]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Our Products</span>
              </Link>
              <Link
                href="/admin/products-manager?tab=categories"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  pathname.startsWith('/admin/products-manager') && currentTab === 'categories'
                    ? 'bg-zinc-800 text-white font-semibold text-[#dbc7af]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Categories & Collections</span>
              </Link>
            </div>
          )}
        </div>

        {/* Gallery Page CMS Link */}
        <Link
          href="/admin/gallery-manager"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname.startsWith('/admin/gallery-manager')
              ? 'bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Images
            className={`w-4 h-4 ${
              pathname.startsWith('/admin/gallery-manager') ? 'text-[#dbc7af]' : 'text-zinc-400'
            }`}
          />
          <span>Gallery Page CMS</span>
        </Link>

        {/* About Page CMS (Our Story) Link */}
        <Link
          href="/admin/about-manager"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname.startsWith('/admin/about-manager')
              ? 'bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <BookOpen
            className={`w-4 h-4 ${
              pathname.startsWith('/admin/about-manager') ? 'text-[#dbc7af]' : 'text-zinc-400'
            }`}
          />
          <span>About Page CMS</span>
        </Link>

        {/* Admin Settings Link */}
        <Link
          href="/admin/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname.startsWith('/admin/settings')
              ? 'bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Settings
            className={`w-4 h-4 ${
              pathname.startsWith('/admin/settings') ? 'text-[#dbc7af]' : 'text-zinc-400'
            }`}
          />
          <span>Admin Settings</span>
        </Link>
      </nav>

      {/* Footer / Quick Actions */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between w-full px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            View Live Site
          </span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
            Public
          </span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
