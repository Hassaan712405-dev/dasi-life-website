'use client';

import { useState, useEffect } from 'react';
import {
  Upload, Loader2, Check, AlertCircle, ArrowUp, ArrowDown, Trash2, 
  Eye, EyeOff, Rocket, RefreshCw, Image as ImageIcon, Edit3, X, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroPosterWithProduct } from '@/types/hero-poster';
import {
  listAllPosters, listProductOptions, uploadHeroImage, upsertPoster,
  deletePoster, reorderPosters, publishPosters
} from '@/services/admin/heroPosterAdmin';
import { revalidateHeroHome } from '@/app/admin/hero-posters/actions';

type ProductOption = { id: string; name: string; slug: string };
const SLOT_COUNT = 4;

export default function HeroPosterManager({ initialPosters }: { initialPosters: HeroPosterWithProduct[] }) {
  const [posters, setPosters] = useState<HeroPosterWithProduct[]>(initialPosters);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  
  // Modal State
  const [editingSlot, setEditingSlot] = useState<number | null>(null);

  useEffect(() => {
    setProductsLoading(true);
    listProductOptions().then(setProducts).finally(() => setProductsLoading(false));
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    const fresh = await listAllPosters();
    setPosters(fresh);
    setRefreshing(false);
  };

  const notify = (type: 'ok' | 'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const handleToggleActive = async (poster: HeroPosterWithProduct) => {
    const res = await upsertPoster({ id: poster.id, is_active: !poster.is_active });
    if (res.success) { await refresh(); notify('ok', poster.is_active ? 'Poster Deactivated.' : 'Poster Activated.'); }
  };

  const handleDelete = async (poster: HeroPosterWithProduct) => {
    if (!confirm('Are you sure you want to delete this poster? This cannot be undone.')) return;
    const res = await deletePoster(poster.id, [poster.storage_path]);
    if (res.success) { await refresh(); notify('ok', 'Poster deleted successfully.'); }
    else { notify('err', res.error ?? 'Delete failed.'); }
  };

  const handleMove = async (from: number, to: number) => {
    if (to < 0 || to >= posters.length) return;
    const next = [...posters];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPosters(next);
    await reorderPosters(next.map((p, i) => ({ id: p.id, sort_order: i })));
    await refresh();
  };

  const handlePublish = async () => {
    setPublishing(true);
    const valid = posters.filter((p) => p.is_active && p.product?.is_active !== false).length;
    if (valid < SLOT_COUNT) { notify('err', `Only ${valid}/${SLOT_COUNT} active. Fill all 4 slots.`); setPublishing(false); return; }
    
    const res = await publishPosters();
    if (res.success) { await revalidateHeroHome(); await refresh(); notify('ok', '🎉 Published to Homepage!'); }
    else { notify('err', res.error ?? 'Publish failed.'); }
    setPublishing(false);
  };

  const validCount = posters.filter((p) => p.is_active && p.product?.is_active !== false).length;
  const liveCount = posters.filter((p) => p.is_active && p.is_published).length;
  const canPublish = validCount === SLOT_COUNT;

  return (
    <div className="space-y-6 pb-20">
      {/* ✅ Top Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Slots</h3>
            <LayoutGrid size={18} className="text-brand-green" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{SLOT_COUNT}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Posters</h3>
            <Check size={18} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{validCount} <span className="text-lg font-normal text-gray-400">/ {SLOT_COUNT}</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Live on Homepage</h3>
            <Rocket size={18} className={liveCount === SLOT_COUNT ? "text-brand-green" : "text-gray-400"} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{liveCount} <span className="text-lg font-normal text-gray-400">/ {SLOT_COUNT}</span></p>
        </div>
      </div>

      {/* ✅ Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={refresh} disabled={refreshing} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          {!canPublish && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              Fill all 4 slots to enable publishing
            </span>
          )}
        </div>
        <button onClick={handlePublish} disabled={publishing || !canPublish} className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-6 py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
          {publishing ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />} 
          {publishing ? 'Publishing...' : 'Publish to Homepage'}
        </button>
      </div>

      {/* ✅ Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`rounded-lg px-4 py-3 text-sm flex items-center gap-3 shadow-md ${msg.type === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.type === 'ok' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="flex-1 font-medium">{msg.text}</span>
            <button onClick={() => setMsg(null)} className="opacity-60 hover:opacity-100"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Grid View of Posters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: SLOT_COUNT }).map((_, index) => {
          const poster = posters[index];
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              
              {/* Image Area */}
              <div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                {poster?.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={40} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Image Uploaded</span>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">SLOT {index + 1}</span>
                  {poster?.is_published && <span className="bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">LIVE</span>}
                  {!poster?.is_active && poster && <span className="bg-gray-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">INACTIVE</span>}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setEditingSlot(index)} className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 flex items-center gap-2">
                    <Edit3 size={16} /> Edit
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{poster?.heading || "No Heading Set"}</h3>
                    <p className="text-xs text-gray-500 mt-1">Product: {poster?.product?.name || "Not Assigned"}</p>
                  </div>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-1">
                    <button onClick={() => handleMove(index, index - 1)} disabled={index === 0} className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button onClick={() => handleMove(index, index + 1)} disabled={index === SLOT_COUNT - 1} className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-30"><ArrowDown size={14} /></button>
                  </div>
                  {poster && (
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleActive(poster)} className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600">
                        {poster.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => handleDelete(poster)} className="p-2 border border-gray-200 rounded-md hover:bg-red-50 text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ✅ Edit Modal */}
      <AnimatePresence>
        {editingSlot !== null && (
          <EditModal
            slot={editingSlot}
            poster={posters[editingSlot]}
            products={products}
            productsLoading={productsLoading}
            onClose={() => setEditingSlot(null)}
            onSaved={refresh}
            notify={notify}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// EDIT MODAL COMPONENT
// =====================================================================
function EditModal({ slot, poster, products, productsLoading, onClose, onSaved, notify }: any) {
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [productId, setProductId] = useState(poster?.product_id ?? '');
  const [buttonLabel, setButtonLabel] = useState(poster?.button_label ?? 'Shop Now');
  const [heading, setHeading] = useState(poster?.heading ?? "Nature's Goodness");
  const [description, setDescription] = useState(poster?.description ?? '');
  const [buttonLink, setButtonLink] = useState(poster?.button_link ?? '');
  const [saving, setSaving] = useState(false);

  const desktopPreview = desktopFile ? URL.createObjectURL(desktopFile) : poster?.image_url;

  const handleSave = async () => {
    if (!productId) { notify('err', 'Product select karein.'); return; }
    setSaving(true);
    try {
      let imageUrl = poster?.image_url;
      let storagePath = poster?.storage_path;

      if (desktopFile) {
        const desk = await uploadHeroImage(desktopFile, 'desktop');
        if (!desk.success || !desk.url) throw new Error(desk.error ?? 'Upload failed');
        imageUrl = desk.url;
        storagePath = desk.path ?? null;
      } else if (!imageUrl) {
        throw new Error('Image upload karein.');
      }

      const res = await upsertPoster({
        id: poster?.id,
        image_url: imageUrl,
        storage_path: storagePath,
        product_id: productId,
        button_label: buttonLabel || 'Shop Now',
        heading: heading,
        description: description,
        button_link: buttonLink,
        sort_order: slot,
        is_active: true,
        is_published: false,
      });

      if (!res.success) throw new Error(res.error ?? 'Save failed');
      notify('ok', `Slot ${slot + 1} saved as draft.`);
      await onSaved();
      onClose();
    } catch (e: any) {
      notify('err', e.message ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Edit3 size={20} className="text-brand-green" /> 
            Edit Slide {slot + 1}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slide Image (Required)</label>
            <label className="block relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-brand-green transition-colors">
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setDesktopFile(e.target.files?.[0] ?? null)} />
              {desktopPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={desktopPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-xs mt-1">JPG, PNG, WebP</span>
                </div>
              )}
            </label>
          </div>

          {/* Right: Text Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Heading</label>
              <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-green focus:outline-none" placeholder="e.g. Nature's Goodness" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Short)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-green focus:outline-none resize-none" placeholder="Brief promo text..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Button Label</label>
                <input type="text" value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-green focus:outline-none" placeholder="Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link (URL)</label>
                <input type="text" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-green focus:outline-none" placeholder="/shop" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assigned Product (Fallback)</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} disabled={productsLoading} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-green focus:outline-none bg-white">
                <option value="">{productsLoading ? 'Loading products...' : 'Select product...'}</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <p className="text-[11px] text-gray-500 mt-1">Agar Button Link khali ho, to yeh product ka page khulega.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-green rounded-md hover:bg-black disabled:opacity-50 flex items-center gap-2 shadow-md">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}