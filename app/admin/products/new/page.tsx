'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Loader2, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import {
  createProduct,
  getAllCategories,
  updateProductImages,
  slugify,
  ProductImageData,
} from '@/services/admin/productAdmin';
import ProductImageManager from '@/components/admin/ProductImageManager';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<ProductImageData[]>([]);

  const [showDetails, setShowDetails] = useState(true);
  const [showHowToUse, setShowHowToUse] = useState(true);
  const [showSpecs, setShowSpecs] = useState(true);

  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    usage_instructions: '',
    shelf_life: '',
    video_url: '',
    price: 0,
    compare_at_price: 0,
    stock: 0,
    category_id: null,
    is_active: true,
    is_featured: false,
    image_url: null,
  });

  useEffect(() => {
    async function loadCategories() {
      const data = await getAllCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev: any) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [formData.name]);

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required.');
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

    setLoading(true);

    const result = await createProduct({
      ...formData,
      image_url: null,
    });

    if (!result.success || !result.productId) {
      setError(result.error || 'Failed to create product.');
      setLoading(false);
      return;
    }

    const imagesResult = await updateProductImages(result.productId, images);

    if (!imagesResult.success) {
      setError(imagesResult.error || 'Product created but images failed to save.');
      setLoading(false);
      return;
    }

    setSaved(true);
    setTimeout(() => router.push('/admin/products'), 1000);
  };

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
            Add New Product
          </h1>
          <p className="text-sm text-brand-text-muted">
            Create a new product with all details for the product page.
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
            Product created! Redirecting...
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
            productSlug={formData.slug || slugify(formData.name) || 'product'}
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
                placeholder="Brief description for product cards..."
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
                placeholder="Full product description that appears on the product page..."
              />
              <p className="text-xs text-brand-text-muted mt-2">
                This appears in the "Description" section on the product details page.
              </p>
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
                placeholder="Enter each step on a new line (one step per line)..."
              />
              <p className="text-xs text-brand-text-muted mt-2">
                Each line becomes a numbered step in the "How to Use" section on the product page.
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
                  placeholder="https://youtube.com/watch?v=... or https://...mp4"
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
            disabled={loading}
            className="flex-1 btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}