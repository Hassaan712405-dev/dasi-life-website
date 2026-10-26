'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Loader2, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getProductById,
  updateProduct,
  getProductImages,
  updateProductImages,
  getAllCategories,
  ProductImageData,
} from '@/services/admin/productAdmin';
import ProductImageManager from '@/components/admin/ProductImageManager';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [images, setImages] = useState<ProductImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [showDetails, setShowDetails] = useState(true);
  const [showHowToUse, setShowHowToUse] = useState(true);
  const [showSpecs, setShowSpecs] = useState(true);

  useEffect(() => {
    async function load() {
      const [product, cats, productImgs] = await Promise.all([
        getProductById(id),
        getAllCategories(),
        getProductImages(id),
      ]);

      if (!product) {
        setError('Product not found.');
        setLoading(false);
        return;
      }

      const p: any = product;
      setFormData({
        name: p.name,
        slug: p.slug,
        short_description: p.short_description || '',
        description: p.description || '',
        usage_instructions: p.usage_instructions || '',
        shelf_life: p.shelf_life || '',
        video_url: p.video_url || '',
        price: p.price,
        compare_at_price: p.compare_at_price || 0,
        stock: p.stock,
        category_id: p.category_id,
        is_active: p.is_active,
        is_featured: p.is_featured,
      });

      setImages(
        productImgs.map((img: any, index: number) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || '',
          sort_order: img.sort_order ?? index,
          is_primary: img.is_primary || false,
          isNew: false,
        }))
      );

      setCategories(cats);
      setLoading(false);
    }
    load();
  }, [id]);

  const update = (field: string, value: any) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0.');
      return;
    }
    if (images.length === 0) {
      setError('At least one product image is required.');
      return;
    }

    setSaving(true);

    const result = await updateProduct(id, formData);

    if (!result.success) {
      setError(result.error || 'Failed to update product.');
      setSaving(false);
      return;
    }

    const imagesResult = await updateProductImages(id, images);

    if (!imagesResult.success) {
      setError(imagesResult.error || 'Product updated but images failed to save.');
      setSaving(false);
      return;
    }

    setSaved(true);
    setTimeout(() => router.push('/admin/products'), 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-brand-text-muted mb-4">{error || 'Product not found'}</p>
        <Link href="/admin/products" className="btn-primary inline-flex">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-1">
            Edit Product
          </h1>
          <p className="text-sm text-brand-text-muted">
            Update all details for {formData.name}.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
          <Check size={20} className="text-green-600" />
          <p className="text-sm text-green-700 font-medium">
            Product updated! Redirecting...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Product Images
          </h2>
          <ProductImageManager
            images={images}
            onChange={setImages}
            productSlug={formData.slug || 'product'}
            maxImages={6}
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => update('name', e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => update('slug', e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Short Description (shown on cards)
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => update('short_description', e.target.value)}
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-brand-green">
              Full Description
            </h2>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showDetails && (
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Description (shown in "Description" section)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                rows={6}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-brand-green">
              How to Use
            </h2>
            <button
              type="button"
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              {showHowToUse ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showHowToUse && (
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Usage Instructions (shown in "How to Use" section)
              </label>
              <textarea
                value={formData.usage_instructions}
                onChange={(e) => update('usage_instructions', e.target.value)}
                rows={5}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                placeholder="Enter each step on a new line..."
              />
              <p className="text-xs text-brand-text-muted mt-2">
                Each line becomes a numbered step in the "How to Use" section.
              </p>
            </div>
          )}
        </div>

        {/* Specifications — Only Expire Life + Video URL */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-brand-green">
              Specifications
            </h2>
            <button
              type="button"
              onClick={() => setShowSpecs(!showSpecs)}
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              {showSpecs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showSpecs && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Expire Life
                </label>
                <input
                  type="text"
                  value={formData.shelf_life || ''}
                  onChange={(e) => update('shelf_life', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="e.g., 24 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.video_url || ''}
                  onChange={(e) => update('video_url', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => update('price', Number(e.target.value))}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Compare Price (Rs)
              </label>
              <input
                type="number"
                value={formData.compare_at_price}
                onChange={(e) => update('compare_at_price', Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => update('stock', Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Category & Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Organization
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Category
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => update('category_id', e.target.value || null)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => update('is_active', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 accent-brand-green cursor-pointer"
                />
                <span className="text-sm font-medium text-brand-text-dark">
                  Active (visible in store)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => update('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 accent-brand-green cursor-pointer"
                />
                <span className="text-sm font-medium text-brand-text-dark">
                  Featured (show on homepage)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 sticky bottom-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-lg">
          <Link
            href="/admin/products"
            className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-3 rounded-md hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}