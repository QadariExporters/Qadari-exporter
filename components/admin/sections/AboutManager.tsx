'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Info, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AboutSection } from '@/lib/db/schema';
import { toast } from 'sonner';

export function AboutManager() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AboutSection>>({
    eyebrow: 'About Qadri Horncraft',
    heading: 'the character of natural horn',
    subheading: 'Authentic Craftsmanship & Ethically Sourced',
    description:
      'Natural horn carries its own variations in tone, texture and pattern. These characteristics give each finished piece a distinctive visual identity.',
    image: '/hero-images/about qadri.png',
    button_text: 'Discover our story',
    button_link: '/about',
    is_active: true,
  });

  const fetchAbout = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/about');
      if (res.ok) {
        const data = await res.json();
        setAbout(data);
        setFormData(data);
      }
    } catch (err) {
      toast.error('Failed to load About section data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading || !formData.description) {
      toast.error('Heading and description are required.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save about section');
      const updated = await res.json();
      setAbout(updated);
      toast.success('About section updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Error saving about section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
        <p className="text-sm">Loading About section configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">About Qadri Horncraft Section CMS</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the brand narrative, typography, and right-hand side featured imagery for the About section.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save About Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Eyebrow Title</label>
              <Input
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                placeholder="About Qadri Horncraft"
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Main Heading <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="the character of natural horn"
                required
                className="bg-stone-50/50 border-stone-300 font-serif text-base"
              />
              <p className="text-[10px] text-stone-400">
                Rendered with the signature elegant italic serif styling on the public page.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Subheading (Optional)</label>
              <Input
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                placeholder="Authentic Craftsmanship & Ethically Sourced"
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Body Narrative / Description <span className="text-rose-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Natural horn carries its own variations in tone..."
                className="bg-stone-50/50 border-stone-300 text-sm leading-relaxed"
              />
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Featured About Image *"
              description="High-resolution photograph of craftspeople or raw horn material."
              folder="/qadri-cms/about"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Button Text</label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Discover our story"
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Button Link</label>
                <Input
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  placeholder="/about"
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold text-stone-800">Display on Home Page</span>
                <p className="text-[11px] text-stone-500">Toggle whether this section is visible.</p>
              </div>
              <Switch
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-10 flex items-center justify-center gap-2 rounded-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save About Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Visual Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>Public Home Page Live Preview</span>
          </div>

          <div className="bg-[#fcfbf9] border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#91724d] font-semibold">
                {formData.eyebrow || 'About Qadri Horncraft'}
              </p>

              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 leading-tight">
                {formData.heading ? (
                  <span>
                    the character of<br />
                    <em className="text-stone-800 italic">natural horn</em>
                  </span>
                ) : (
                  'Heading goes here'
                )}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {formData.description || 'Description narrative text...'}
              </p>

              {formData.image && (
                <div className="mt-4 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                  <img
                    src={formData.image}
                    alt="About preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
