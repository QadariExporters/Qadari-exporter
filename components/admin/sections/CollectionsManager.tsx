'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
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

export function CollectionsManager() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
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
    label: '',
    description: '',
    image: '',
    slug: '',
    link: '/products',
    display_order: 1,
    is_active: true,
  });

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (err) {
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      title: '',
      label: '',
      description: '',
      image: '',
      slug: '',
      link: '/products',
      display_order: collections.length + 1,
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
      toast.error('Please enter a collection name and upload an image.');
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
        if (!res.ok) throw new Error('Failed to update collection');
        toast.success('Collection updated successfully');
      } else {
        const res = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create collection');
        toast.success('Collection created successfully');
      }

      setIsDialogOpen(false);
      fetchCollections();
    } catch (err: any) {
      toast.error(err.message || 'Error saving collection');
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
        setCollections(
          collections.map((c) => (c.id === item.id ? { ...c, is_active: !c.is_active } : c))
        );
        toast.success(`Collection ${!item.is_active ? 'activated' : 'deactivated'}`);
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
        setCollections(collections.filter((c) => c.id !== deleteId));
        toast.success('Collection deleted');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete collection');
      }
    } catch (err) {
      toast.error('Error deleting collection');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.label && c.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Our Collection Section CMS</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the category showcase cards displayed on the public Home Page and Products archive.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
          />
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} of {collections.length} items
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
            <p className="text-xs">Loading collections...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <p className="text-sm font-medium text-stone-700">No collections found</p>
            <p className="text-xs mt-1">Try another search or add a new collection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Collection Name</th>
                  <th className="py-3 px-4">Tag / Label</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-stone-500">
                      #{item.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900 text-sm">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-stone-500 truncate max-w-xs">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.label ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                          {item.label}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        isActive={item.is_active}
                        interactive
                        onClick={() => handleToggleActive(item)}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id)}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Collection' : 'Add New Collection'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Collection Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Drinking Horns"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Card Label / Subtitle</label>
                <Input
                  placeholder="e.g. Viking Style"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Slug</label>
                <Input
                  placeholder="drinking-horns"
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
              <label className="text-xs font-semibold text-stone-700">Description</label>
              <Textarea
                placeholder="Brief description of this collection..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Collection Card Image *"
              folder="/qadri-cms/collections"
            />

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
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
                ) : editingItem ? (
                  'Update Collection'
                ) : (
                  'Create Collection'
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
        title="Delete Collection"
        description="Are you sure you want to delete this collection card? This will remove it from the home page."
        confirmLabel="Delete Collection"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
