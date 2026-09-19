'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Star, Loader2, Image as ImageIcon, X, Layers, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ProductItem, CollectionItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function FullCatalogManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    name: '',
    title: '',
    slug: '',
    category: '',
    short_description: '',
    description: '',
    image: '',
    gallery_images: [],
    material: 'Natural horn',
    finish: 'Polished',
    size: 'Available on request',
    color: 'Natural variation',
    customization: 'Available on request',
    moq: '100',
    featured: false,
    display_order: 1,
    is_active: true,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const fetchCatalogData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, colRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/collections'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      if (colRes.ok) {
        const colData = await colRes.json();
        const names = Array.from(new Set(colData.map((c: CollectionItem) => c.name || c.title).filter(Boolean))) as string[];
        setCategories(names);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      title: '',
      slug: '',
      category: '',
      short_description: '',
      description: '',
      image: '',
      gallery_images: [],
      material: 'Natural horn',
      finish: 'Polished',
      size: 'Available on request',
      color: 'Natural variation',
      customization: 'Available on request',
      moq: '100',
      featured: false,
      display_order: products.length + 1,
      is_active: true,
    });
    setNewGalleryUrl('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ProductItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      gallery_images: item.gallery_images || [],
    });
    setNewGalleryUrl('');
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

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), url],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      toast.error('Product name and primary image are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        const res = await fetch(`/api/admin/products/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update product');
        toast.success('Product updated successfully');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create product');
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      fetchCatalogData();
    } catch (err: any) {
      toast.error(err.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === item.id ? { ...p, is_active: !p.is_active } : p))
        );
        toast.success(`Product ${!item.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (item: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === item.id ? { ...p, featured: !p.featured } : p))
        );
        toast.success(`Product featured status updated`);
      }
    } catch (err) {
      toast.error('Failed to update featured flag');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== deleteId));
        toast.success('Product deleted from catalog');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err) {
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Uncategorized'
        ? !p.category || p.category === 'None' || p.category === 'none' || p.category === ''
        : p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategoriesList: string[] = Array.from(
    new Set([
      ...categories,
      ...products.map((p) => p.category).filter((c): c is string => Boolean(c)),
    ])
  ).filter((c) => c !== 'None' && c !== 'none' && c !== 'Uncategorized');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">All Products Catalog</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Add new products category-wise or without category, manage specifications, pricing, gallery photos, and URLs.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by name, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-stone-50/50 border-stone-300 text-xs h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-60">
              <SelectItem value="All">All Categories ({products.length})</SelectItem>
              <SelectItem value="Uncategorized">
                Uncategorized ({products.filter((p) => !p.category || p.category === 'None' || p.category === '').length})
              </SelectItem>
              {allCategoriesList.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat} ({products.filter((p) => p.category === cat).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} of {products.length} products
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
            <p className="text-xs">Loading product catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-3">
            <p className="text-sm font-bold text-stone-800">No products found</p>
            <p className="text-xs text-stone-500">Try changing your search filter or click "Add New Product".</p>
            <Button
              onClick={openCreateDialog}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add First Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16">Image</th>
                  <th className="py-3 px-4">Product Name & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Specifications</th>
                  <th className="py-3 px-4">Gallery Photos</th>
                  <th className="py-3 px-4">Home Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative">
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
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-stone-900 text-sm">{item.name}</p>
                        <a
                          href={`/products/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-400 hover:text-stone-700"
                          title="View live product page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="font-mono text-[11px] text-stone-400 mt-0.5">/products/{item.slug}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-xs mt-0.5">
                        {item.short_description || item.description || 'No description'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {item.category && item.category !== 'None' && item.category !== 'none' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {item.category}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-stone-400 bg-stone-50 border border-stone-200/60">
                          None
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div className="space-y-0.5 text-[11px]">
                        <p><span className="text-stone-400">Mat:</span> {item.material || 'Natural horn'}</p>
                        <p><span className="text-stone-400">Finish:</span> {item.finish || 'Polished'}</p>
                        <p><span className="text-stone-400">MOQ:</span> {item.moq ? item.moq.replace(/\s*pcs\b/gi, '').trim() : '100'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-xs text-stone-700 font-medium">
                          {(item.gallery_images?.length || 0) + 1}
                        </span>
                        <span className="text-[10px] text-stone-400">photos</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                          item.featured
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-stone-500 hover:text-stone-800'
                        }`}
                        title="Toggle Featured on Home Page"
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-500 text-amber-600' : ''}`} />
                        <span>{item.featured ? 'Featured' : 'Standard'}</span>
                      </button>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-stone-900">
              {editingItem ? `Edit Product: ${editingItem.name}` : 'Add New Product to Catalog'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
                1. Basic Information & Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Buffalo Horn Drinking Tankard"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="bg-stone-50/50 border-stone-300 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-700">
                      Category (Optional)
                    </label>
                    {formData.category && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, category: '' })}
                        className="text-[10px] text-stone-400 hover:text-rose-600 underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={formData.category || 'none'}
                      onValueChange={(val) =>
                        setFormData({ ...formData, category: val === 'none' ? '' : val })
                      }
                    >
                      <SelectTrigger className="bg-stone-50/50 border-stone-300">
                        <SelectValue placeholder="No Category (Optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-56">
                        <SelectItem value="none" className="text-stone-400 font-medium">
                          None (No Category / Uncategorized)
                        </SelectItem>
                        {allCategoriesList.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    Optional. You can leave this blank if the product has no category.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Product Slug (URL) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="buffalo-horn-drinking-tankard"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="bg-stone-50/50 border-stone-300 font-mono text-xs"
                  />
                  <p className="text-[10px] text-stone-400">
                    Live URL: /products/{formData.slug || 'slug'}
                  </p>
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
                <label className="text-xs font-semibold text-stone-700">Short Summary</label>
                <Input
                  placeholder="A considered everyday form with the natural character of horn..."
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Description</label>
                <Textarea
                  placeholder="A refined horn form that lets natural variation, tone and pattern remain part of the object..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            {/* Images & Gallery */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
                2. Product Images & Gallery
              </h4>

              <ImageUpload
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Primary Featured Product Image *"
                folder="/qadri-cms/products"
              />

              {/* Multi-image Gallery */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-stone-700 block">
                  Additional Gallery Images (Thumbnails Carousel)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(formData.gallery_images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group bg-stone-100">
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <div className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-2 text-center bg-stone-50/50">
                    <ImageUpload
                      value={newGalleryUrl}
                      onChange={(url) => handleAddGalleryImage(url)}
                      label="+ Add Photo"
                      folder="/qadri-cms/products/gallery"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
                3. Detailed Specifications
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Material</label>
                  <Input
                    placeholder="Natural horn / Buffalo horn"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Finish</label>
                  <Input
                    placeholder="Polished / Smooth / Raw"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Size</label>
                  <Input
                    placeholder="Available on request / 15-18 oz"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Colour / Variation</label>
                  <Input
                    placeholder="Natural variation / Amber / Dark"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Customization</label>
                  <Input
                    placeholder="Available on request"
                    value={formData.customization}
                    onChange={(e) => setFormData({ ...formData, customization: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Minimum Order (MOQ)</label>
                  <Input
                    placeholder="100"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Status & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                <div>
                  <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Feature on Home Page</span>
                  </p>
                  <p className="text-[10px] text-stone-500">Also show on Home Page "Our Products"</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div>
                  <p className="text-xs font-semibold text-stone-800">Published / Active</p>
                  <p className="text-[10px] text-stone-500">Visible to public catalog</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
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
                  'Save Product'
                ) : (
                  'Save Product'
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
        title="Delete Product"
        description="Are you sure you want to delete this product? This will remove it from the catalog and any featured sections."
        confirmLabel="Delete Product"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
