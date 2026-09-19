'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Image as ImageIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { GalleryImageItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImageItem | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State (Simplified without category for Home Page Gallery)
  const [formData, setFormData] = useState<Partial<GalleryImageItem>>({
    title: '',
    label: '',
    image: '',
    alt_text: '',
    display_order: 1,
    is_active: true,
  });

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      toast.error('Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      label: '',
      image: '',
      alt_text: '',
      display_order: images.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: GalleryImageItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      label: item.label || '',
      image: item.image || '',
      alt_text: item.alt_text || '',
      display_order: item.display_order || 1,
      is_active: item.is_active !== false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload or provide an image.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Clean payload for Home Page gallery
      const payload = {
        ...formData,
        category: 'Home Gallery',
        title: formData.title || formData.label || 'Home Gallery Image',
        label: formData.label || formData.title || '',
      };

      if (editingItem) {
        const res = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update gallery image');
        toast.success('Home page gallery image updated successfully');
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add gallery image');
        toast.success('Home page gallery image added successfully');
      }

      setIsDialogOpen(false);
      fetchImages();
    } catch (err: any) {
      toast.error(err.message || 'Error saving gallery image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: GalleryImageItem) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setImages(images.map((img) => (img.id === item.id ? { ...img, is_active: !img.is_active } : img)));
        toast.success(`Image ${!item.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateOrder = async (item: GalleryImageItem, newOrder: number) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (res.ok) {
        setImages(images.map((img) => (img.id === item.id ? { ...img, display_order: newOrder } : img)));
        toast.success(`Order updated to #${newOrder}`);
      }
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter((img) => img.id !== deleteId));
        toast.success('Gallery image deleted');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete gallery image');
      }
    } catch (err) {
      toast.error('Error deleting gallery image');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = images.filter((img) => {
    const matchesSearch =
      (img.title && img.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.label && img.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.alt_text && img.alt_text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const activeImages = images.filter((img) => img.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900">Home Page - Editorial Gallery CMS</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              {activeImages.length} Active Photos
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the photographs displayed in the Home Page "06 / Editorial gallery — The craft in detail" section.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Image</span>
        </Button>
      </div>

      {/* Live Home Page Gallery Section Preview Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#dbc7af]">
            <Eye className="w-4 h-4" />
            <span>Home Page Section Live Preview (First 4 Active Images)</span>
          </div>
          <span className="text-[11px] text-stone-400">
            06 / Editorial gallery — The craft in detail
          </span>
        </div>

        {activeImages.length === 0 ? (
          <div className="p-6 bg-stone-800/60 rounded-lg text-center text-xs text-stone-400">
            No active images in home page gallery. Upload an image below to display it.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {activeImages.slice(0, 4).map((img, idx) => (
              <div key={img.id} className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-700 group">
                <img
                  src={img.image}
                  alt={img.alt_text || img.label || `Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-[#dbc7af] truncate font-medium">
                    #{img.display_order} {img.label || img.title || 'Photograph'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search and Count */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 sm:max-w-sm w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search captions or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
          />
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} of {images.length} gallery images
        </span>
      </div>

      {/* Visual Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
          <p className="text-xs">Loading gallery...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">No images found</p>
            <p className="text-xs text-stone-500 mt-1">Upload a new photograph to the Home Page gallery.</p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Gallery Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={img.image}
                    alt={img.alt_text || img.label || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-[#dbc7af] px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                    #{img.display_order}
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <p className="font-semibold text-stone-900 text-xs truncate" title={img.label || img.title}>
                    {img.label || img.title || 'Untitled Image'}
                  </p>
                  {img.alt_text && (
                    <p className="text-[10px] text-stone-500 truncate" title={img.alt_text}>
                      {img.alt_text}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                <StatusBadge
                  isActive={img.is_active}
                  interactive
                  onClick={() => handleToggleActive(img)}
                />

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(img)}
                    className="h-7 w-7 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    title="Edit Image"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(img.id)}
                    className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simplified Pure Image Dialog (No Category) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Home Page Gallery Image' : 'Add Home Page Gallery Image'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Image Upload with ImageKit */}
            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Editorial Photograph *"
              folder="/qadri-cms/gallery"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Display Order</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: Number(e.target.value) })
                }
                placeholder="1, 2, 3..."
                className="bg-stone-50/50 border-stone-300"
              />
              <p className="text-[10px] text-stone-500">
                Order in which the image appears on the Home Page Editorial Gallery grid.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Caption / Label (Optional)</label>
              <Input
                placeholder="e.g. A quiet study in natural tone"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value, title: e.target.value })}
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Alt Text (Accessibility & SEO)</label>
              <Input
                placeholder="Descriptive alt text for image"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                className="bg-stone-50/50 border-stone-300 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold text-stone-700 block">Active / Display on Home</span>
                <span className="text-[10px] text-stone-500">Enable to show on home page</span>
              </div>
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
                ) : editingItem ? (
                  'Save Image'
                ) : (
                  'Save Image'
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
        title="Delete Home Page Gallery Image"
        description="Are you sure you want to delete this photograph from the home page editorial gallery?"
        confirmLabel="Delete Image"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
