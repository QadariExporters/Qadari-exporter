'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Info,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
  Cpu,
  PlusCircle,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardStats {
  totalCollections: number;
  activeCollections: number;
  totalProducts: number;
  activeProducts: number;
  totalGalleryImages: number;
  activeGalleryImages: number;
  totalHeroSlides: number;
  activeHeroSlides: number;
  totalProcessSteps: number;
  lastUpdated: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metricCards = [
    {
      title: 'Our Collection',
      count: stats?.totalCollections ?? 0,
      active: stats?.activeCollections ?? 0,
      icon: Layers,
      href: '/admin/home-page?tab=collections',
      addHref: '/admin/home-page?tab=collections',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Our Products',
      count: stats?.totalProducts ?? 0,
      active: stats?.activeProducts ?? 0,
      icon: ShoppingBag,
      href: '/admin/home-page?tab=products',
      addHref: '/admin/home-page?tab=products',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Hero Slides',
      count: stats?.totalHeroSlides ?? 0,
      active: stats?.activeHeroSlides ?? 0,
      icon: Sparkles,
      href: '/admin/home-page?tab=hero',
      addHref: '/admin/home-page?tab=hero',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Editorial Gallery',
      count: stats?.totalGalleryImages ?? 0,
      active: stats?.activeGalleryImages ?? 0,
      icon: ImageIcon,
      href: '/admin/home-page?tab=gallery',
      addHref: '/admin/home-page?tab=gallery',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-[#dbc7af] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated CMS Admin Session</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
            Welcome to Qadri Horncraft Admin Setting
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Manage your public website hero slides, collections, products catalog, process steps, and editorial visual archives in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="bg-white border-stone-200/80 shadow-xs hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-stone-900 tracking-tight">
                    {isLoading ? '...' : card.count}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {isLoading ? '' : `${card.active} active`}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <Link
                    href={card.href}
                    className="text-stone-700 hover:text-stone-900 font-medium inline-flex items-center gap-1 group"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={card.addHref}
                    className="text-stone-500 hover:text-stone-800 inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Sections & Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="bg-white border-stone-200 lg:col-span-2 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-stone-900">
              CMS Section Actions
            </CardTitle>
            <CardDescription className="text-xs text-stone-500">
              Quick shortcuts to modify every home page section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/home-page?tab=hero"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Hero Section</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update slides, banners, CTA titles & links
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/home-page?tab=about"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">About Section</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Edit story, heritage, typography & hero image
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/home-page?tab=collections"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Our Collection</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Reorder, upload & manage collection cards
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/home-page?tab=products"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Products Catalog</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Add products, specifications & featured flags
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/home-page?tab=process"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">The Process</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Step-by-step craftsmanship workflow steps
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/home-page?tab=gallery"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Editorial Gallery</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload visual archive photographs & captions
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System & Architecture Info */}
        <Card className="bg-white border-stone-200 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-stone-900">
              System Architecture
            </CardTitle>
            <CardDescription className="text-xs text-stone-500">
              Configuration and storage health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Authentication</span>
              <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                Custom Bcrypt + JWT (No Supabase Auth)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Database Engine</span>
              <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                Supabase Postgres
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Media Storage</span>
              <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                ImageKit CDN & Local
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Real-time Updates</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Synchronized
              </span>
            </div>

            <div className="pt-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Preview Public Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
