'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ProcessStepItem } from '@/lib/db/schema';
import { toast } from 'sonner';

export function ProcessManager() {
  const [steps, setSteps] = useState<ProcessStepItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcessStepItem | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ProcessStepItem>>({
    step_number: '01',
    title: '',
    description: '',
    image: '',
    display_order: 1,
    is_active: true,
  });

  const fetchSteps = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/process');
      if (res.ok) {
        const data = await res.json();
        setSteps(data);
      }
    } catch (err) {
      toast.error('Failed to load process steps');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    setFormData({
      step_number: nextNum,
      title: '',
      description: '',
      image: '',
      display_order: steps.length + 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ProcessStepItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image) {
      toast.error('Step number, title, description, and image are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        const res = await fetch(`/api/admin/process/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update step');
        toast.success('Process step updated successfully');
      } else {
        const res = await fetch('/api/admin/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create step');
        toast.success('Process step created successfully');
      }

      setIsDialogOpen(false);
      fetchSteps();
    } catch (err: any) {
      toast.error(err.message || 'Error saving process step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: ProcessStepItem) => {
    try {
      const res = await fetch(`/api/admin/process/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setSteps(steps.map((s) => (s.id === item.id ? { ...s, is_active: !s.is_active } : s)));
        toast.success(`Process step ${!item.is_active ? 'activated' : 'deactivated'}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/process/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setSteps(steps.filter((s) => s.id !== deleteId));
        toast.success('Process step deleted');
        setDeleteId(null);
      } else {
        toast.error('Failed to delete step');
      }
    } catch (err) {
      toast.error('Error deleting step');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-900">The Process Section CMS</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the craftsmanship workflow steps displayed in "The Process" section on the Home Page.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Process Step</span>
        </Button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-600" />
          <p className="text-xs">Loading process steps...</p>
        </div>
      ) : steps.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <p className="text-sm font-medium text-stone-700">No process steps found</p>
          <p className="text-xs mt-1">Add your first craftsmanship step.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="relative h-44 bg-stone-100 overflow-hidden border-b border-stone-100">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-[#dbc7af] px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                    {step.step_number}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm tracking-wider uppercase">
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono">Order: #{step.display_order}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                <StatusBadge
                  isActive={step.is_active}
                  interactive
                  onClick={() => handleToggleActive(step)}
                />

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(step)}
                    className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(step.id)}
                    className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Process Step' : 'Add Process Step'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Step Number</label>
                <Input
                  placeholder="01"
                  value={formData.step_number}
                  onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                  required
                  className="bg-stone-50/50 border-stone-300 font-mono"
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
              <label className="text-xs font-semibold text-stone-700">
                Step Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. SELECT, SHAPE, REFINE, FINISH"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                required
                className="bg-stone-50/50 border-stone-300 font-bold uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                Step Description <span className="text-rose-500">*</span>
              </label>
              <Textarea
                placeholder="The natural character of each piece begins the conversation..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="bg-stone-50/50 border-stone-300"
              />
            </div>

            <ImageUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Step Photograph *"
              folder="/qadri-cms/process"
            />

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-700">Active / Published</span>
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
                  'Update Step'
                ) : (
                  'Create Step'
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
        title="Delete Process Step"
        description="Are you sure you want to delete this process step? This will update the sequence on the home page."
        confirmLabel="Delete Step"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
