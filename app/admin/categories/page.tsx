'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Save,
  FolderTree,
} from 'lucide-react';
import {
  getAllCategoriesWithCount,
  createCategory,
  updateCategory,
  deleteCategory,
  slugify,
  CategoryWithCount,
  CategoryFormData,
} from '@/services/admin/categoryAdmin';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image_url: null,
    sort_order: 0,
  });

  // Load categories
  async function loadCategories() {
    setLoading(true);
    const data = await getAllCategoriesWithCount();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug && !editingCategory) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [formData.name, editingCategory]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: null,
      sort_order: categories.length + 1,
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (category: CategoryWithCount) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url,
      sort_order: category.sort_order,
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required.');
      return;
    }

    setProcessing(true);

    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, formData);
    } else {
      result = await createCategory(formData);
    }

    if (!result.success) {
      setError(result.error || 'Failed to save category.');
      setProcessing(false);
      return;
    }

    await loadCategories();
    setProcessing(false);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    setProcessing(true);
    const result = await deleteCategory(id);

    if (!result.success) {
      setError(result.error || 'Failed to delete category.');
      setProcessing(false);
      return;
    }

    await loadCategories();
    setDeleteConfirm(null);
    setProcessing(false);
  };

  const update = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
            Categories
          </h1>
          <p className="text-sm text-brand-text-muted">
            Organize your Unani products into wellness departments.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-sm text-brand-text-muted">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree size={48} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-brand-text-muted mb-4">No categories yet.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="btn-primary inline-flex"
            >
              <Plus size={16} className="mr-2" />
              Add First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Slug</th>
                  <th className="text-left px-4 py-3">Products</th>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Category */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-cream rounded-md flex items-center justify-center shrink-0">
                          <FolderTree size={20} className="text-brand-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-text-dark">
                            {category.name}
                          </p>
                          {category.description && (
                            <p className="text-xs text-brand-text-muted line-clamp-1 max-w-xs">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-3 text-sm text-brand-text-muted font-mono">
                      {category.slug}
                    </td>

                    {/* Product count */}
                    <td className="px-4 py-3 text-sm font-medium text-brand-text-dark">
                      {category.product_count}
                    </td>

                    {/* Sort order */}
                    <td className="px-4 py-3 text-sm text-brand-text-muted">
                      {category.sort_order}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="w-8 h-8 rounded-md border border-gray-300 hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(category.id)}
                          className="w-8 h-8 rounded-md border border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-brand-text-muted text-center">
        Showing {categories.length} categories
      </p>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-heading font-semibold text-xl text-brand-green">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g., Herbal Majoon"
                  required
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  placeholder="herbal-majoon"
                  required
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  placeholder="Short description for this category..."
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => update('sort_order', Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <p className="text-xs text-brand-text-muted mt-1">
                  Lower number = appears first
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-3 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 btn-primary py-3 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingCategory ? 'Save Changes' : 'Create Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-text-dark mb-1">
                    Delete Category?
                  </h3>
                  <p className="text-sm text-brand-text-muted">
                    This action cannot be undone. Products in this category
                    must be moved first.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="text-brand-text-muted hover:text-brand-text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={processing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Category'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}