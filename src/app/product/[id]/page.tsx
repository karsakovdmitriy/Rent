import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ProductClient } from './product-client';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
