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
import { motion, AnimatePresence } from 'framer-motion';
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

  async function loadCategories() {
    setLoading(true);
    const data = await getAllCategoriesWithCount();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Organize your Unani products into wellness departments.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm"
        >
          <Plus size={14} />
          Add Category
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={28} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-brand-text-muted">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FolderTree size={40} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-brand-text-muted mb-4">No categories yet.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-5 py-2.5 rounded-md transition-colors text-xs sm:text-sm"
            >
              <Plus size={14} />
              Add First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-3 sm:px-4 py-3">Category</th>
                  <th className="text-left px-3 sm:px-4 py-3">Slug</th>
                  <th className="text-left px-3 sm:px-4 py-3">Products</th>
                  <th className="text-left px-3 sm:px-4 py-3">Order</th>
                  <th className="text-right px-3 sm:px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 bg-brand-cream rounded-md flex items-center justify-center shrink-0">
                          <FolderTree size={16} className="text-brand-green" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                            {category.name}
                          </p>
                          {category.description && (
                            <p className="text-[10px] sm:text-xs text-brand-text-muted line-clamp-1 max-w-[180px]">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-brand-text-muted font-mono">
                      {category.slug}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-brand-text-dark">
                      {category.product_count}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-brand-text-muted">
                      {category.sort_order}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(category.id)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <p className="text-[10px] sm:text-xs text-brand-text-muted text-center">
        Showing {categories.length} categories
      </p>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-xl max-w-lg w-full my-4 sm:my-8"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl">
                <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-green">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-md p-2.5 sm:p-3 flex items-start gap-2"
                  >
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g., Herbal Majoon"
                    required
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => update('slug', e.target.value)}
                    placeholder="herbal-majoon"
                    required
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={3}
                    placeholder="Short description..."
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => update('sort_order', Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                  <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
                    Lower number = appears first
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 sm:py-3 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-brand-green hover:bg-black text-white font-medium py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        {editingCategory ? 'Save' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-1">
                      Delete Category?
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text-muted">
                      Products in this category must be moved first.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="text-brand-text-muted hover:text-brand-text-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-xs sm:text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}