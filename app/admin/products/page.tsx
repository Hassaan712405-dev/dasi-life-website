'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CheckSquare,
  Square,
  Check,
  EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllProducts,
  getAllCategories,
  deleteProduct,
  bulkActivateProducts,
  bulkDeactivateProducts,
  bulkDeleteProducts,
} from '@/services/admin/productAdmin';
import { getProductImageUrl } from '@/lib/utils/productImage';
import type { Product } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Bulk actions state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<
    'activate' | 'deactivate' | 'delete' | null
  >(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  async function loadData() {
    setLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Single delete
  const handleDelete = async (id: string) => {
    setDeleting(true);
    const result = await deleteProduct(id);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      setDeleteConfirm(null);
    }
    setDeleting(false);
  };

  // ✅ Bulk action handler
  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    setBulkProcessing(true);

    let result;
    if (bulkAction === 'activate') {
      result = await bulkActivateProducts(selectedIds);
    } else if (bulkAction === 'deactivate') {
      result = await bulkDeactivateProducts(selectedIds);
    } else {
      result = await bulkDeleteProducts(selectedIds);
    }

    setBulkProcessing(false);

    if (result.success) {
      await loadData();
      setSelectedIds([]);
      setBulkAction(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      categories.find((c) => c.slug === selectedCategory)?.id ===
        product.category_id;

    return matchesSearch && matchesCategory;
  });

  // ✅ Select all logic
  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
            Products
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Manage your Unani formulations, stock levels, and pricing.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm"
        >
          <Plus size={14} />
          Add New Product
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col md:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
        >
          <option>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* ✅ Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-brand-green text-white rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={18} />
              <span className="text-xs sm:text-sm font-medium">
                {selectedIds.length} product
                {selectedIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBulkAction('activate')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-medium px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors"
              >
                <Check size={12} />
                Activate
              </button>

              <button
                type="button"
                onClick={() => setBulkAction('deactivate')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-medium px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors"
              >
                <EyeOff size={12} />
                Deactivate
              </button>

              <button
                type="button"
                onClick={() => setBulkAction('delete')}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors"
                aria-label="Clear selection"
              >
                <X size={12} />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <Loader2
              size={28}
              className="animate-spin text-brand-green mx-auto mb-3"
            />
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <AlertCircle
              size={40}
              className="text-brand-text-muted mx-auto mb-4"
            />
            <p className="text-xs sm:text-sm text-brand-text-muted mb-4">
              No products found.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium px-5 py-2.5 rounded-md transition-colors text-xs sm:text-sm"
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  {/* ✅ Select All checkbox */}
                  <th className="w-10 px-3 sm:px-4 py-3">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="flex items-center justify-center text-brand-green hover:text-brand-green-light transition-colors"
                      aria-label={allSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allSelected ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-3 sm:px-4 py-3">Product</th>
                  <th className="text-left px-3 sm:px-4 py-3">Category</th>
                  <th className="text-left px-3 sm:px-4 py-3">Price</th>
                  <th className="text-left px-3 sm:px-4 py-3">Stock</th>
                  <th className="text-left px-3 sm:px-4 py-3">Status</th>
                  <th className="text-right px-3 sm:px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const categoryName =
                    categories.find((c) => c.id === product.category_id)?.name ||
                    '—';
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-green/5'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* ✅ Checkbox */}
                      <td className="px-3 sm:px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSelect(product.id)}
                          className="flex items-center justify-center text-brand-green hover:text-brand-green-light transition-colors"
                          aria-label={
                            isSelected ? 'Deselect product' : 'Select product'
                          }
                        >
                          {isSelected ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-cream rounded-md overflow-hidden shrink-0">
                            <img
                              src={getProductImageUrl(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-brand-text-dark line-clamp-2 max-w-[150px] sm:max-w-xs">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-brand-text-muted">
                        {categoryName}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-brand-text-dark whitespace-nowrap">
                        Rs {product.price.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            product.stock < 10
                              ? 'text-red-600'
                              : product.stock < 30
                              ? 'text-orange-600'
                              : 'text-brand-text-dark'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
                            product.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          >
                            <Pencil size={12} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(product.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <p className="text-[10px] sm:text-xs text-brand-text-muted text-center">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* ✅ Bulk Action Confirmation Modal */}
      <AnimatePresence>
        {bulkAction && (
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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      bulkAction === 'delete' ? 'bg-red-100' : 'bg-blue-100'
                    }`}
                  >
                    {bulkAction === 'delete' ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : bulkAction === 'activate' ? (
                      <Check size={18} className="text-blue-500" />
                    ) : (
                      <EyeOff size={18} className="text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-1">
                      {bulkAction === 'delete'
                        ? 'Delete Products?'
                        : bulkAction === 'activate'
                        ? 'Activate Products?'
                        : 'Deactivate Products?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text-muted">
                      {selectedIds.length} product
                      {selectedIds.length !== 1 ? 's' : ''} will be{' '}
                      {bulkAction === 'delete'
                        ? 'permanently deleted'
                        : bulkAction === 'activate'
                        ? 'activated'
                        : 'deactivated'}
                      .
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkAction(null)}
                  className="text-brand-text-muted hover:text-brand-text-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setBulkAction(null)}
                  className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkAction}
                  disabled={bulkProcessing}
                  className={`flex-1 font-medium py-2.5 rounded-md transition-colors text-xs sm:text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white ${
                    bulkAction === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-brand-green hover:bg-black'
                  }`}
                >
                  {bulkProcessing ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Delete Modal */}
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
                      Delete Product?
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text-muted">
                      This action cannot be undone.
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
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-xs sm:text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {deleting ? (
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