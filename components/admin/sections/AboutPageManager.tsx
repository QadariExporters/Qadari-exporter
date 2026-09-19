'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, ExternalLink, Plus, Trash2, Info, BookOpen, Layers, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AboutPageData, AboutValueItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function AboutPageManager() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/about-page');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      toast.error('Failed to load About page data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/about-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update About page');
      toast.success('Our Story / About page updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating about page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleValueChange = (index: number, field: keyof AboutValueItem, value: string) => {
    if (!data) return;
    const updated = [...(data.values_list || [])];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, values_list: updated });
  };

  const handleAddValue = () => {
    if (!data) return;
    const list = data.values_list || [];
    const nextNum = (list.length + 1).toString().padStart(2, '0');
    setData({
      ...data,
      values_list: [...list, { number: nextNum, title: 'NEW VALUE', description: '' }],
    });
  };

  const handleRemoveValue = (index: number) => {
    if (!data) return;
    const updated = (data.values_list || []).filter((_, i) => i !== index);
    setData({ ...data, values_list: updated });
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
        <p className="text-sm">Loading About Page content...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10 py-2">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Edit Public About Page ("Our Story")</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Modify text, story paragraphs, craftsmanship values, and imagery for <span className="font-semibold text-stone-700">/about</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public /about</span>
          </a>

          <Button
            type="submit"
            disabled={isSaving}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Section 1: Hero Header */}
      <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
          <div className="p-1.5 rounded-lg bg-stone-900 text-[#dbc7af]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">1. Top Hero Section</h4>
            <p className="text-xs text-stone-500">Banner header at the top of the About page.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Hero Eyebrow</label>
            <Input
              value={data.hero_eyebrow || ''}
              onChange={(e) => setData({ ...data, hero_eyebrow: e.target.value })}
              placeholder="e.g. The company"
              className="bg-white border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Hero Main Title</label>
            <Input
              value={data.hero_title || ''}
              onChange={(e) => setData({ ...data, hero_title: e.target.value })}
              placeholder="e.g. Our story."
              className="bg-white border-stone-300 font-serif"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Hero Subtitle / Description</label>
          <Textarea
            value={data.hero_description || ''}
            onChange={(e) => setData({ ...data, hero_description: e.target.value })}
            rows={2}
            placeholder="Introduction narrative..."
            className="bg-white border-stone-300"
          />
        </div>

        <ImageUpload
          value={data.hero_image || ''}
          onChange={(url) => setData({ ...data, hero_image: url })}
          label="Hero Full-Width Background Image"
          folder="/qadri-cms/about"
        />
      </div>

      {/* Section 2: 01 / Our Story */}
      <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
          <div className="p-1.5 rounded-lg bg-stone-900 text-[#dbc7af]">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">2. Section 01: Our Story</h4>
            <p className="text-xs text-stone-500">Brand background narrative and featured photograph.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Eyebrow Tag</label>
            <Input
              value={data.story_eyebrow || ''}
              onChange={(e) => setData({ ...data, story_eyebrow: e.target.value })}
              placeholder="01 / Our story"
              className="bg-white border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Heading Line</label>
            <Input
              value={data.story_heading || ''}
              onChange={(e) => setData({ ...data, story_heading: e.target.value })}
              placeholder="e.g. A point of view"
              className="bg-white border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Italic Accent Subtitle</label>
            <Input
              value={data.story_italic_text || ''}
              onChange={(e) => setData({ ...data, story_italic_text: e.target.value })}
              placeholder="e.g. still taking shape"
              className="bg-white border-stone-300 italic"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Main Story Paragraph</label>
          <Textarea
            value={data.story_paragraph_1 || ''}
            onChange={(e) => setData({ ...data, story_paragraph_1: e.target.value })}
            rows={3}
            placeholder="Qadri Exporters brings together natural horn, considered forms..."
            className="bg-white border-stone-300"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Muted Footer Note</label>
          <Input
            value={data.story_note || ''}
            onChange={(e) => setData({ ...data, story_note: e.target.value })}
            placeholder="e.g. Company history and operating details are available on request."
            className="bg-white border-stone-300 text-xs"
          />
        </div>

        <ImageUpload
          value={data.story_image || ''}
          onChange={(url) => setData({ ...data, story_image: url })}
          label="Our Story Featured Photograph"
          folder="/qadri-cms/about"
        />
      </div>

      {/* Section 3: 02 / Our Material */}
      <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
          <div className="p-1.5 rounded-lg bg-stone-900 text-[#dbc7af]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">3. Section 02: Our Material</h4>
            <p className="text-xs text-stone-500">Material philosophy and texture showcase.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Eyebrow Tag</label>
            <Input
              value={data.material_eyebrow || ''}
              onChange={(e) => setData({ ...data, material_eyebrow: e.target.value })}
              placeholder="02 / Our material"
              className="bg-white border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Heading Line</label>
            <Input
              value={data.material_heading || ''}
              onChange={(e) => setData({ ...data, material_heading: e.target.value })}
              placeholder="e.g. Let natural variation"
              className="bg-white border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Italic Accent Subtitle</label>
            <Input
              value={data.material_italic_text || ''}
              onChange={(e) => setData({ ...data, material_italic_text: e.target.value })}
              placeholder="e.g. remain visible."
              className="bg-white border-stone-300 italic"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Material Philosophy Description</label>
          <Textarea
            value={data.material_description || ''}
            onChange={(e) => setData({ ...data, material_description: e.target.value })}
            rows={3}
            placeholder="Horn carries its own tonal range, pattern and texture..."
            className="bg-white border-stone-300"
          />
        </div>

        <ImageUpload
          value={data.material_image || ''}
          onChange={(url) => setData({ ...data, material_image: url })}
          label="Our Material Showcase Photograph"
          folder="/qadri-cms/about"
        />
      </div>

      {/* Section 4: 03 / Our Values */}
      <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-stone-900 text-[#dbc7af]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">4. Section 03: Company Values</h4>
              <p className="text-xs text-stone-500">Core craftsmanship values and commitment pillars.</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddValue}
            className="text-xs h-8 flex items-center gap-1 bg-white border-stone-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Value</span>
          </Button>
        </div>

        <div className="space-y-1 max-w-xs">
          <label className="text-xs font-semibold text-stone-700">Values Eyebrow</label>
          <Input
            value={data.values_eyebrow || ''}
            onChange={(e) => setData({ ...data, values_eyebrow: e.target.value })}
            placeholder="03 / Our values"
            className="bg-white border-stone-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {(data.values_list || []).map((val, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-stone-200 p-4 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full pr-8">
                  <Input
                    value={val.number}
                    onChange={(e) => handleValueChange(idx, 'number', e.target.value)}
                    placeholder="01"
                    className="w-16 font-mono text-xs font-bold border-stone-300"
                  />
                  <Input
                    value={val.title}
                    onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                    placeholder="QUALITY"
                    className="font-bold text-xs uppercase tracking-wider border-stone-300 flex-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveValue(idx)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Remove Value"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Textarea
                value={val.description || ''}
                onChange={(e) => handleValueChange(idx, 'description', e.target.value)}
                placeholder="Brief description of this value..."
                rows={2}
                className="text-xs border-stone-200 text-stone-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Button Bar */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 h-10 shadow-md"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Changes...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save All Changes
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
