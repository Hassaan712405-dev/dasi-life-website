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
import {
  getAllCMSPages,
  updateCMSPage,
  CMSPage,
} from '@/services/admin/cmsAdmin';

// Slug to path mapping
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

  // Load pages
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
    setFormData({
      title: page.title,
      content: page.content,
    });
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          CMS Pages
        </h1>
        <p className="text-sm text-brand-text-muted">
          Edit your store's static content pages such as About, FAQ, Shipping,
          Returns, and Legal policies.
        </p>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-sm text-brand-text-muted">Loading pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-brand-text-muted">No CMS pages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-4 py-3">Page</th>
                  <th className="text-left px-4 py-3">Slug</th>
                  <th className="text-left px-4 py-3">Last Updated</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => {
                  const path = pathMap[page.slug] || `/${page.slug}`;
                  return (
                    <tr
                      key={page.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Page */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-brand-green/10 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-brand-green" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-brand-text-dark">
                              {page.title}
                            </p>
                            <Link
                              href={path}
                              target="_blank"
                              className="text-xs text-brand-text-muted hover:text-brand-green transition-colors inline-flex items-center gap-1"
                            >
                              View live page
                              <ExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-3 text-sm text-brand-text-muted font-mono">
                        /{page.slug}
                      </td>

                      {/* Last updated */}
                      <td className="px-4 py-3 text-sm text-brand-text-muted">
                        {new Date(page.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => openEditModal(page)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                          >
                            <Pencil size={12} />
                            Edit Content
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-brand-text-muted text-center">
        Showing {pages.length} pages
      </p>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading font-semibold text-xl text-brand-green">
                  Edit: {editingPage.title}
                </h2>
                <p className="text-xs text-brand-text-muted mt-0.5 font-mono">
                  /{editingPage.slug}
                </p>
              </div>
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

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={15}
                  required
                  placeholder="Write your page content here..."
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-y font-mono"
                />
                <p className="text-xs text-brand-text-muted mt-1">
                  You can use plain text. Paragraphs will be preserved.
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}