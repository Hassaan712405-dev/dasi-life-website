'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Upload,
  X,
} from 'lucide-react';
import {
  createProduct,
  getAllCategories,
  slugify,
  ProductFormData,
} from '@/services/admin/productAdmin';
import { uploadProductImage } from '@/services/admin/storageService';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    ingredients: '',
    usage_instructions: '',
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
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [formData.name]);

  const update = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    setError('');

    const slug = formData.slug || slugify(formData.name) || 'product';
    const result = await uploadProductImage(file, slug);

    if (!result.success || !result.url) {
      setError(result.error || 'Failed to upload image.');
      setUploading(false);
      return;
    }

    setImagePreview(result.url);
    update('image_url', result.url);
    setUploading(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    update('image_url', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    setLoading(true);
    const result = await createProduct(formData);

    if (!result.success) {
      setError(result.error || 'Failed to create product.');
      setLoading(false);
      return;
    }

    setSaved(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
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
            Create a new Unani formulation for your catalog.
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
        {/* Product Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Product Image
          </h2>

          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 hover:border-brand-green rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <>
                  <Loader2
                    size={32}
                    className="animate-spin text-brand-green mb-3"
                  />
                  <p className="text-sm text-brand-text-muted">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-3">
                    <Upload size={20} className="text-brand-green" />
                  </div>
                  <p className="text-sm font-medium text-brand-text-dark mb-1">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-brand-text-muted">
                    PNG, JPG up to 5MB
                  </p>
                </>
              )}
            </label>
          )}
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
                Short Description
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => update('short_description', e.target.value)}
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
            </div>
          </div>
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
                onChange={(e) =>
                  update('compare_at_price', Number(e.target.value))
                }
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

        {/* Ingredients & Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-lg text-brand-green mb-5">
            Ingredients & Usage
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Ingredients
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => update('ingredients', e.target.value)}
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Usage Instructions
              </label>
              <textarea
                value={formData.usage_instructions}
                onChange={(e) => update('usage_instructions', e.target.value)}
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
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
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-3 rounded-md hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
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