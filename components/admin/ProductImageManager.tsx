'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, GripVertical, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { uploadProductImage } from '@/services/admin/storageService';

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  sort_order: number;
  is_primary: boolean;
  isNew?: boolean; // New upload not yet saved to DB
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  productSlug: string;
  maxImages?: number;
}

export default function ProductImageManager({
  images,
  onChange,
  productSlug,
  maxImages = 6,
}: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);

    const newImages: ProductImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB.');
        continue;
      }

      const result = await uploadProductImage(file, productSlug);
      if (result.success && result.url) {
        newImages.push({
          url: result.url,
          alt: '',
          sort_order: images.length + newImages.length,
          is_primary: images.length === 0 && newImages.length === 0,
          isNew: true,
        });
      } else {
        setError(result.error || 'Upload failed.');
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If removed image was primary, make first remaining image primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], is_primary: true };
    }
    onChange(newImages.map((img, i) => ({ ...img, sort_order: i })));
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [dragged] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, dragged);

    onChange(newImages.map((img, i) => ({ ...img, sort_order: i })));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand-text-dark">
            Product Images ({images.length}/{maxImages})
          </p>
          <p className="text-xs text-brand-text-muted mt-0.5">
            Drag to reorder. Click the star to set primary image.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-move ${
                img.is_primary
                  ? 'border-brand-green ring-2 ring-brand-green/20'
                  : 'border-gray-200 hover:border-brand-green'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <Image
                src={img.url}
                alt={img.alt || 'Product image'}
                fill
                sizes="150px"
                className="object-cover"
              />

              {/* Primary badge */}
              {img.is_primary && (
                <div className="absolute top-1 left-1 bg-brand-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                  <Star size={8} className="fill-white" /> PRIMARY
                </div>
              )}

              {/* New badge */}
              {img.isNew && (
                <div className="absolute top-1 right-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  NEW
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="w-7 h-7 rounded-md bg-white hover:bg-brand-green hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                    title="Set as primary"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-7 h-7 rounded-md bg-white hover:bg-red-500 hover:text-white text-brand-text-dark flex items-center justify-center transition-colors"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Drag handle */}
              <div className="absolute bottom-1 right-1 bg-white/80 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={10} className="text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <label className="border-2 border-dashed border-gray-300 hover:border-brand-green rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-brand-green mb-2" />
              <p className="text-sm text-brand-text-muted">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center mb-2">
                <Upload size={18} className="text-brand-green" />
              </div>
              <p className="text-sm font-medium text-brand-text-dark">
                Click to upload or drag files
              </p>
              <p className="text-xs text-brand-text-muted mt-1">
                PNG, JPG, WebP · Max 5MB each · Up to {maxImages - images.length} more
              </p>
            </>
          )}
        </label>
      )}
    </div>
  );
}