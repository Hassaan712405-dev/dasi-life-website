import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES (internal)
// ============================================
interface StockRow {
  stock: number;
}

interface LowStockProductRow {
  id: string;
  name: string;
  stock: number;
  low_stock_threshold: number | null;
}

// ============================================
// REDUCE STOCK
// ============================================
export async function reduceStock(
  productId: string | null,
  variantId: string | null,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  if (quantity <= 0) {
    return { success: false, error: 'Invalid quantity' };
  }

  // ✅ Variant stock reduce
  if (variantId) {
    const { data: variant, error: fetchError } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();

    if (fetchError || !variant) {
      return { success: false, error: 'Variant not found' };
    }

    const typedVariant = variant as StockRow;

    if (typedVariant.stock < quantity) {
      return {
        success: false,
        error: `Only ${typedVariant.stock} left in stock`,
      };
    }

    const { error } = await supabase
      .from('product_variants')
      .update({ stock: typedVariant.stock - quantity })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // ✅ Product stock reduce
  if (productId) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return { success: false, error: 'Product not found' };
    }

    const typedProduct = product as StockRow;

    if (typedProduct.stock < quantity) {
      return {
        success: false,
        error: `Only ${typedProduct.stock} left in stock`,
      };
    }

    const { error } = await supabase
      .from('products')
      .update({ stock: typedProduct.stock - quantity })
      .eq('id', productId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  return { success: false, error: 'No product or variant specified' };
}

// ============================================
// RESTORE STOCK
// ============================================
export async function restoreStock(
  productId: string | null,
  variantId: string | null,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  if (quantity <= 0) {
    return { success: false, error: 'Invalid quantity' };
  }

  // ✅ Variant stock restore
  if (variantId) {
    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();

    if (!variant) {
      return { success: false, error: 'Variant not found' };
    }

    const typedVariant = variant as StockRow;

    const { error } = await supabase
      .from('product_variants')
      .update({ stock: typedVariant.stock + quantity })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // ✅ Product stock restore
  if (productId) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const typedProduct = product as StockRow;

    const { error } = await supabase
      .from('products')
      .update({ stock: typedProduct.stock + quantity })
      .eq('id', productId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  return { success: false, error: 'No product or variant specified' };
}

// ============================================
// CHECK STOCK AVAILABILITY
// ============================================
export async function checkStockAvailability(
  productId: string | null,
  variantId: string | null,
  quantity: number
): Promise<{ available: boolean; currentStock: number }> {
  const supabase = createClient();

  // ✅ Variant check
  if (variantId) {
    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();

    const typedVariant = variant as StockRow | null;

    return {
      available: !!typedVariant && typedVariant.stock >= quantity,
      currentStock: typedVariant?.stock || 0,
    };
  }

  // ✅ Product check
  if (productId) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    const typedProduct = product as StockRow | null;

    return {
      available: !!typedProduct && typedProduct.stock >= quantity,
      currentStock: typedProduct?.stock || 0,
    };
  }

  return { available: false, currentStock: 0 };
}

// ============================================
// GET LOW STOCK PRODUCTS
// ============================================
export async function getLowStockProducts(): Promise<
  Array<{
    id: string;
    name: string;
    stock: number;
    low_stock_threshold: number;
    status: 'Critical' | 'Low Stock' | 'Out of Stock';
  }>
> {
  const supabase = createClient();

  const { data: productsRaw } = await supabase
    .from('products')
    .select('id, name, stock, low_stock_threshold')
    .eq('is_active', true)
    .order('stock', { ascending: true });

  if (!productsRaw) return [];

  const products = productsRaw as LowStockProductRow[];

  return products.map((p: LowStockProductRow) => {
    const threshold = p.low_stock_threshold || 10;

    let status: 'Critical' | 'Low Stock' | 'Out of Stock';
    if (p.stock === 0) {
      status = 'Out of Stock';
    } else if (p.stock <= threshold / 2) {
      status = 'Critical';
    } else {
      status = 'Low Stock';
    }

    return {
      id: p.id,
      name: p.name,
      stock: p.stock,
      low_stock_threshold: threshold,
      status,
    };
  });
}