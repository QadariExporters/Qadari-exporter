'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { CollectionItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function CategoriesManager() {
  const [categories, setCategories] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CollectionItem>>({
    name: '',
    title: '',
    slug: '',
    label: '',
    description: '',
    image: '',
    link: '/products',
    display_order: 1,
    is_active: true,
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/collections');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      title: '',
      slug: '',
      label: 'Handcrafted',
      description: '',
      image: '',
      link: '/products',
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: CollectionItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      title: prev.title || name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      toast.error('Category name and image are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        const res = await fetch(`/api/admin/collections/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update category');
        toast.success('Category updated successfully');
      } else {
        const res = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create category');
        toast.success('Category created & added to site navigation!');
      }

      setIsDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: CollectionItem) => {
    try {
      const res = await fetch(`/api/admin/collections/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setCategories(
          categories.map((c) => (c.id === item.id ? { ...c, is_active: !c.is_active } : c))
        );
        toast.success(`Category ${!item.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/collections/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== deleteId));
        toast.success('Category deleted');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      toast.error('Error deleting category');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.slug && c.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Categories & Collections Management</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Create new categories. Any active category will automatically appear in the site navigation Products dropdown!
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 sm:max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
          />
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} of {categories.length} categories
        </span>
      </div>

      {/* Grid Cards */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
          <p className="text-xs">Loading categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <p className="text-sm font-bold text-stone-800">No categories found</p>
          <Button
            onClick={openCreateDialog}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-[#dbc7af] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    #{item.display_order}
                  </div>
                  {item.label && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-stone-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {item.label}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                    <a
                      href={`/products?category=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-400 hover:text-stone-700"
                      title="View filtered products"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="font-mono text-[10px] text-stone-400">slug: {item.slug || item.name.toLowerCase()}</p>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-2 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                <StatusBadge
                  isActive={item.is_active}
                  interactive
                  onClick={() => handleToggleActive(item)}
                />

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(item)}
                    className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(item.id)}
                    className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border border-stone-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? `Edit Category: ${editingItem.name}` : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Luxury Drinkware"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Slug</label>
                <Input
                  placeholder="luxury-drinkware"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-stone-50/50 border-stone-300 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: Number(e.target.value) })
                  }
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Badge / Label</label>
              <Input
                placeholder="e.g. Viking Style / Premium Quality"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="bg-stone-50/50 border-stone-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Description</label>
              <Textarea
                placeholder="Brief summary of pieces in this collection..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="bg-stone-50/50 border-stone-300 text-xs"
              />
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Category Cover Image *"
              folder="/qadri-cms/collections"
            />

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold text-stone-700 block">Active Status</span>
                <span className="text-[10px] text-stone-500">Show in navbar dropdown & filter bar</span>
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
                  'Save Category'
                ) : (
                  'Save Category'
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
        title="Delete Category"
        description="Are you sure you want to delete this category? Products assigned to it will still remain in the catalog."
        confirmLabel="Delete Category"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
