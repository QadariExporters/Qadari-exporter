'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { HeroSlide } from '@/lib/db/schema';
import { toast } from 'sonner';

export function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    eyebrow: '',
    title: '',
    description: '',
    image: '',
    button_1_text: 'Explore collection',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 1,
    is_active: true,
  });

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/hero');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      toast.error('Failed to load hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateDialog = () => {
    setEditingSlide(null);
    setFormData({
      eyebrow: '',
      title: '',
      description: '',
      image: '',
      button_1_text: 'Explore collection',
      button_1_link: '/products',
      button_2_text: 'Enquire on WhatsApp',
      button_2_link: '',
      display_order: slides.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error('Please enter a title and select an image.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingSlide) {
        const res = await fetch(`/api/admin/hero/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update hero slide');
        toast.success('Hero slide updated successfully');
      } else {
        const res = await fetch('/api/admin/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create hero slide');
        toast.success('Hero slide created successfully');
      }

      setIsDialogOpen(false);
      fetchSlides();
    } catch (err: any) {
      toast.error(err.message || 'Error saving hero slide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const res = await fetch(`/api/admin/hero/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !slide.is_active }),
      });
      if (res.ok) {
        setSlides(slides.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s)));
        toast.success(`Slide ${!slide.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/hero/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== deleteId));
        toast.success('Hero slide deleted');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete slide');
      }
    } catch (err) {
      toast.error('Error deleting slide');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Hero Section CMS</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the hero slides, titles, subtitles, imagery, and WhatsApp CTA buttons on your home page.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </Button>
      </div>

      {/* Hero Slides Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
            <p className="text-xs">Loading hero slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <p className="text-sm font-medium text-stone-700">No hero slides found</p>
            <p className="text-xs mt-1">Create your first hero slide using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Eyebrow & Title</th>
                  <th className="py-3 px-4">CTA Buttons</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-stone-500">
                      #{slide.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-10 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {slide.eyebrow && (
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                          {slide.eyebrow}
                        </p>
                      )}
                      <p className="font-semibold text-stone-900 truncate" title={slide.title}>
                        {slide.title.replace('\n', ' ')}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate" title={slide.description}>
                        {slide.description}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-stone-800 truncate">
                          1: {slide.button_1_text || 'None'} ({slide.button_1_link || '-'})
                        </span>
                        <span className="text-[10px] text-stone-500 truncate">
                          2: {slide.button_2_text || 'None'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        isActive={slide.is_active}
                        interactive
                        onClick={() => handleToggleActive(slide)}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(slide)}
                          className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(slide.id)}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Eyebrow Tag</label>
                <Input
                  placeholder="e.g. Viking Heritage"
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                Hero Title <span className="text-rose-500">*</span>
              </label>
              <Textarea
                placeholder="e.g. AUTHENTIC VIKING&#10;DRINKING HORNS."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                rows={2}
                className="bg-stone-50/50 border-stone-300 font-serif"
              />
              <p className="text-[10px] text-stone-400">Use line break to split title lines on the hero.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Hero Description</label>
              <Textarea
                placeholder="Brief description underneath the title..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Hero Background Image *"
              folder="/qadri-cms/hero"
            />

            {/* Buttons / Actions */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Call to Action Buttons
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Button 1 Text</label>
                  <Input
                    value={formData.button_1_text}
                    onChange={(e) => setFormData({ ...formData, button_1_text: e.target.value })}
                    className="bg-stone-50/50 border-stone-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Button 1 Link</label>
                  <Input
                    value={formData.button_1_link}
                    onChange={(e) => setFormData({ ...formData, button_1_link: e.target.value })}
                    className="bg-stone-50/50 border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Button 2 Text</label>
                  <Input
                    value={formData.button_2_text}
                    onChange={(e) => setFormData({ ...formData, button_2_text: e.target.value })}
                    className="bg-stone-50/50 border-stone-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Button 2 Link (Optional)</label>
                  <Input
                    placeholder="Leave empty for default WhatsApp"
                    value={formData.button_2_link}
                    onChange={(e) => setFormData({ ...formData, button_2_link: e.target.value })}
                    className="bg-stone-50/50 border-stone-300"
                  />
                </div>
              </div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-700">Publish / Active State</span>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-stone-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 hover:bg-stone-800 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </span>
                ) : editingSlide ? (
                  'Update Hero Slide'
                ) : (
                  'Create Hero Slide'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Hero Slide"
        description="Are you sure you want to delete this hero slide? This action cannot be undone."
        confirmLabel="Delete Slide"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
