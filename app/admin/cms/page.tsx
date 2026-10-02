'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Pencil,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllCMSPages,
  updateCMSPage,
  CMSPage,
} from '@/services/admin/cmsAdmin';

const pathMap: Record<string, string> = {
  about: '/about',
  faq: '/faq',
  shipping: '/shipping',
  returns: '/returns',
  privacy: '/privacy',
  terms: '/terms',
  contact: '/contact',
};

export default function AdminCMSPage() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  async function loadPages() {
    setLoading(true);
    const data = await getAllCMSPages();
    setPages(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPages();
  }, []);

  const openEditModal = (page: CMSPage) => {
    setEditingPage(page);
    setFormData({ title: page.title, content: page.content });
    setError('');
  };

  const closeModal = () => {
    setEditingPage(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required.');
      return;
    }

    setProcessing(true);
    const result = await updateCMSPage(editingPage.id, formData);

    if (!result.success) {
      setError(result.error || 'Failed to update page.');
      setProcessing(false);
      return;
    }

    await loadPages();
    setProcessing(false);
    closeModal();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          CMS Pages
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          Edit your store's static content pages.
        </p>
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
            <p className="text-xs sm:text-sm text-brand-text-muted">Loading pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FileText size={40} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-brand-text-muted">
              No CMS pages found. Run the database seed to create default pages.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-3 sm:px-4 py-3">Page</th>
                  <th className="text-left px-3 sm:px-4 py-3">Slug</th>
                  <th className="text-left px-3 sm:px-4 py-3">Last Updated</th>
                  <th className="text-right px-3 sm:px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <motion.tr
                    key={page.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-cream rounded-md flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-brand-green" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                          {page.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-sm text-brand-text-muted font-mono">
                      /{page.slug}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-sm text-brand-text-muted whitespace-nowrap">
                      {new Date(page.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <Link
                          href={pathMap[page.slug] || `/${page.slug}`}
                          target="_blank"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          title="View page"
                        >
                          <ExternalLink size={12} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(page)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-300 hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                          title="Edit page"
                        >
                          <Pencil size={12} />
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
        Showing {pages.length} CMS pages
      </p>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPage && (
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
              className="bg-white rounded-xl max-w-2xl w-full my-4 sm:my-8"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl">
                <div>
                  <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
                    Edit Page
                  </h2>
                  <p className="text-[10px] sm:text-xs text-brand-text-muted font-mono">
                    /{editingPage.slug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    rows={12}
                    required
                    placeholder="Write your page content here... (Markdown supported)"
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green resize-y"
                  />
                  <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
                    Supports Markdown formatting.
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
                    className="flex-1 bg-brand-green hover:bg-black text-white font-medium py-2.5 sm:py-3 rounded-md transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}