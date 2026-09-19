'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Image as ImageIcon, Eye, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { GalleryImageItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function GalleryPageManager() {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImageItem | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<GalleryImageItem>>({
    title: '',
    label: '',
    category: 'Products',
    image: '',
    alt_text: '',
    display_order: 1,
    is_active: true,
  });

  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);

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

  const existingCategories = Array.from(
    new Set(
      images
        .map((img) => img.category)
        .filter((cat) => Boolean(cat) && cat !== 'Home Gallery')
    )
  );

  const allCategories = existingCategories.length > 0 ? existingCategories : ['Products', 'Craftsmanship', 'Details'];

  const openCreateDialog = () => {
    setEditingItem(null);
    setIsCustomCat(false);
    setCustomCategory('');
    setFormData({
      title: '',
      label: '',
      category: allCategories[0] || 'Products',
      image: '',
      alt_text: '',
      display_order: images.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: GalleryImageItem) => {
    setEditingItem(item);
    setIsCustomCat(false);
    setCustomCategory('');
    setFormData({
      title: item.title || '',
      label: item.label || '',
      category: item.category || 'Products',
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

    const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : (formData.category || 'Products');

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        category: finalCategory,
        title: formData.title || formData.label || 'Gallery Image',
        label: formData.label || formData.title || '',
      };

      if (editingItem) {
        const res = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update gallery image');
        toast.success('Gallery photo updated successfully');
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add gallery image');
        toast.success('Gallery photo added to public archive');
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
        toast.success(`Photo ${!item.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter((img) => img.id !== deleteId));
        toast.success('Photo removed from gallery');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete gallery photo');
      }
    } catch (err) {
      toast.error('Error deleting gallery photo');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter images (exclude purely internal 'Home Gallery' if distinct category exists, but show if filtered)
  const filtered = images.filter((img) => {
    const matchesSearch =
      (img.title && img.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.label && img.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.category && img.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.alt_text && img.alt_text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ? true : img.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900">Gallery Page — Visual Archive CMS</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              {images.filter((i) => i.is_active).length} Active Photos
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the photographs, categories, and captions displayed on the public <span className="font-semibold text-stone-700">/gallery</span> page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/gallery"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Gallery</span>
          </a>

          <Button
            onClick={openCreateDialog}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Photo</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search captions, tags, or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44 bg-stone-50/50 border-stone-300 text-xs h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Categories ({images.length})</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat} ({images.filter((i) => i.category === cat).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} of {images.length} photographs
        </span>
      </div>

      {/* Visual Masonry / Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
          <p className="text-xs">Loading gallery photographs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">No photographs found</p>
            <p className="text-xs text-stone-500 mt-1">Upload a photo to appear in the public gallery.</p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Photo
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
                <div className="relative h-52 bg-stone-100 overflow-hidden">
                  <img
                    src={img.image}
                    alt={img.alt_text || img.label || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-[#dbc7af] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    #{img.display_order}
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-stone-900 px-2 py-0.5 rounded text-[10px] font-semibold border border-stone-200/80">
                    {img.category || 'Products'}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <p className="font-semibold text-stone-900 text-xs truncate" title={img.label || img.title}>
                    {img.label || img.title || 'Untitled Photograph'}
                  </p>
                  {img.alt_text && (
                    <p className="text-[10px] text-stone-500 truncate" title={img.alt_text}>
                      Alt: {img.alt_text}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 pt-2 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
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
                    className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    title="Edit Photo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(img.id)}
                    className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border border-stone-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Gallery Photograph' : 'Add Photograph to Gallery'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Image Upload with ImageKit */}
            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Gallery Photograph *"
              folder="/qadri-cms/gallery"
            />

            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">
                Gallery Filter Category <span className="text-rose-500">*</span>
              </label>

              {!isCustomCat ? (
                <div className="flex gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(val) => {
                      if (val === '__custom__') {
                        setIsCustomCat(true);
                      } else {
                        setFormData({ ...formData, category: val });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-stone-50/50 border-stone-300">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="__custom__" className="font-semibold text-amber-700">
                        + Create New Category...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCustomCat(false)}
                    className="text-xs shrink-0"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Caption / Label (Appears on Hover)</label>
              <Input
                placeholder="e.g. A quiet study in natural tone"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value, title: e.target.value })}
                className="bg-stone-50/50 border-stone-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: Number(e.target.value) })
                  }
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Alt Text (SEO)</label>
                <Input
                  placeholder="Horn craft photo"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold text-stone-700 block">Published Status</span>
                <span className="text-[10px] text-stone-500">Show on public /gallery page</span>
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
                  'Save Photo'
                ) : (
                  'Save Photo'
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
        title="Delete Gallery Photo"
        description="Are you sure you want to delete this photograph from the visual archive gallery?"
        confirmLabel="Delete Photo"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
