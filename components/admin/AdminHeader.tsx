'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, User, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAdminUser(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard Overview';
    if (path.startsWith('/admin/home')) return 'Home Page CMS';
    if (path.startsWith('/admin/hero')) return 'Hero Section CMS';
    if (path.startsWith('/admin/about')) return 'About Section CMS';
    if (path.startsWith('/admin/collections')) return 'Collections CMS';
    if (path.startsWith('/admin/products')) return 'Products CMS';
    if (path.startsWith('/admin/process')) return 'Process Steps CMS';
    if (path.startsWith('/admin/gallery')) return 'Editorial Gallery CMS';
    if (path.startsWith('/admin/settings')) return 'Admin Settings';
    return 'Admin CMS';
  };


  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-md lg:hidden text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-stone-900 leading-tight">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-xs text-stone-500 hidden sm:block">
            Manage your public website content in real time
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          View Live Site
        </a>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-xs">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-stone-800 leading-tight">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-stone-500">{adminUser?.role || 'Superadmin'}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-stone-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-stone-900">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-stone-500 truncate">{adminUser?.email || 'admin@qadriexporters.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-stone-100" />
            <DropdownMenuItem
              onClick={() => router.push('/admin/settings')}
              className="cursor-pointer text-stone-700 text-xs flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-stone-500" />
              <span>Admin Settings & Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-stone-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 text-xs flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
