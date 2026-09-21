'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Star, Loader2, CheckCircle2, ArrowRight, Sparkles, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ProductItem } from '@/lib/db/schema';
import { toast } from 'sonner';

const CATEGORIES = ['Decorative', 'Cups & Vessels', 'Utensils', 'Jewellery', 'Knife Handles', 'Custom Orders'];

interface ProductsManagerProps {
  homeOnly?: boolean;
}

export function ProductsManager({ homeOnly = true }: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
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
    category: 'Decorative',
    price: null,
    short_description: '',
    description: '',
    image: '',
    material: 'Natural horn',
    finish: 'Polished',
    size: 'Available on request',
    color: 'Natural variation',
    customization: 'Available on request',
    moq: '100',
    featured: true,
    display_order: 1,
    is_active: true,
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    const featuredCount = products.filter((p) => p.featured).length;
    setFormData({
      name: '',
      title: '',
      slug: '',
      category: 'Decorative',
      price: null,
      short_description: '',
      description: '',
      image: '',
      material: 'Natural horn',
      finish: 'Polished',
      size: 'Available on request',
      color: 'Natural variation',
      customization: 'Available on request',
      moq: '100',
      featured: true, // Default to featured so it shows on home page
      display_order: featuredCount + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ProductItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      price: item.price !== undefined && item.price !== null ? item.price : null,
    });
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
      toast.error('Product name and image are required.');
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
        toast.success(
          formData.featured
            ? 'Product created & added to Home Page!'
            : 'Product created successfully'
        );
      }

      setIsDialogOpen(false);
      fetchProducts();
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

  const handleToggleFeatured = async (item: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newFeaturedState = !item.featured;
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeaturedState }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === item.id ? { ...p, featured: newFeaturedState } : p))
        );
        if (newFeaturedState) {
          toast.success(`"${item.name}" added to Home Page!`);
        } else {
          toast.info(`"${item.name}" removed from Home Page`);
        }
      }
    } catch (err) {
      toast.error('Failed to update featured flag');
    }
  };

  const handleUpdateOrder = async (item: ProductItem, newOrder: number) => {
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === item.id ? { ...p, display_order: newOrder } : p))
        );
        toast.success(`Display order updated to #${newOrder}`);
      }
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== deleteId));
        toast.success('Product deleted');
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

  // Products filtered by view mode
  const featuredProducts = products.filter((p) => p.featured);

  const filtered = featuredProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Non-featured products for the add-to-home catalog picker
  const catalogFiltered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900">
              Home Page - Our Products Section
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              ★ {featuredProducts.length} on Home Page
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage products displayed on the Home Page "Our Products" section. Only items marked as Featured appear here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCatalogModalOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#dbc7af]" />
            <span>Select Products from Catalog</span>
          </Button>
        </div>
      </div>

      {/* View Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-100/70 p-1.5 rounded-xl border border-stone-200">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold bg-white text-stone-900 shadow-xs border border-stone-200/80 flex items-center justify-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Home Page Products ({featuredProducts.length})</span>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 px-2 font-medium">
          💡 The public Home Page displays these {featuredProducts.length} products in order.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search Home Page products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-stone-50/50 border-stone-300 text-xs h-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 bg-stone-50/50 border-stone-300 text-xs h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filtered.length} home featured products
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
            <p className="text-xs">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">
                No products featured on Home Page
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Click "Select from Catalog" to choose existing products to feature on the Home Page.
              </p>
            </div>
            <Button
              onClick={() => setIsCatalogModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Select Products from Catalog
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4 w-20">Order</th>
                  <th className="py-3 px-4 w-20">Image</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Home Status</th>
                  <th className="py-3 px-4">Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        defaultValue={item.display_order}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== item.display_order) {
                            handleUpdateOrder(item, val);
                          }
                        }}
                        className="w-14 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono text-stone-700 focus:bg-white focus:outline-none focus:border-stone-500"
                        title="Click to edit display order"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group">
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
                      <p className="text-[11px] text-stone-500 truncate max-w-xs">
                        {item.short_description || item.description || 'No description'}
                      </p>
                      {item.material && (
                        <span className="text-[10px] text-stone-400">
                          {item.material} • MOQ: {item.moq || 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.price !== undefined && item.price !== null ? (
                        <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Inquiry</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(item, e)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs ${
                          item.featured
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                        }`}
                        title={item.featured ? 'Click to remove from Home Page' : 'Click to feature on Home Page'}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-500 text-amber-600' : 'text-stone-400'}`} />
                        <span>{item.featured ? '★ On Home' : 'Catalog Only'}</span>
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
                          onClick={(e) => handleToggleFeatured(item, e)}
                          className="h-8 px-2 text-[11px] text-amber-800 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 font-medium"
                          title="Remove from Home Page"
                        >
                          Remove from Home
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit Details"
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

      {/* Catalog Selector Modal ("Add to Home Page") */}
      <Dialog open={isCatalogModalOpen} onOpenChange={setIsCatalogModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-white border border-stone-200 p-0">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Select Products to Feature on Home Page</span>
              </DialogTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                Toggle products on or off to add them to the Home Page "Our Products" section.
              </p>
            </div>
          </div>

          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search catalog products..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="pl-9 bg-white border-stone-300 text-xs h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-stone-100">
            {catalogFiltered.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs">No products match your search.</div>
            ) : (
              catalogFiltered.map((p) => (
                <div key={p.id} className="pt-2 flex items-center justify-between gap-3 hover:bg-stone-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {p.category} • MOQ: {p.moq || 'N/A'}
                        {p.price !== undefined && p.price !== null ? ` • ₹${Number(p.price).toFixed(2)}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(p, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        p.featured
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                      <span>{p.featured ? 'Featured on Home' : '+ Add to Home'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <span className="text-xs text-stone-600 font-medium">
              ★ {featuredProducts.length} total products featured on Home Page
            </span>
            <Button
              onClick={() => setIsCatalogModalOpen(false)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Premium Horn Bowl"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="bg-stone-50/50 border-stone-300">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Price (₹ INR / Piece)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 45.00 (Optional)"
                  value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  className="bg-stone-50/50 border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Slug</label>
                <Input
                  placeholder="premium-horn-bowl"
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
                placeholder="Detailed craft description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Primary Product Image *"
              folder="/qadri-cms/products"
            />

            {/* Specifications */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Product Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Material</label>
                  <Input
                    placeholder="Natural horn"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Finish</label>
                  <Input
                    placeholder="Polished"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Minimum Order (MOQ)</label>
                  <Input
                    placeholder="100"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    className="bg-stone-50/50 border-stone-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                <div>
                  <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Feature on Home Page</span>
                  </p>
                  <p className="text-[10px] text-stone-500">Show in "Our Products" section</p>
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
                  'Update Product'
                ) : (
                  'Create Product'
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
        description="Are you sure you want to delete this product? This will permanently remove it from the catalog and home page."
        confirmLabel="Delete Product"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
