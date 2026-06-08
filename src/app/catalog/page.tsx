import { createClient } from '@/utils/supabase/server';
import { CatalogContent } from './catalog-content';
import { Suspense } from 'react';

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*');
  const { data: products } = await supabase.from('products').select('*');

  return (
    <div className="px-5 py-8">
      <Suspense fallback={<div>Загрузка...</div>}>
        <CatalogContent
          initialCategories={categories || []}
          initialProducts={products || []}
        />
      </Suspense>
    </div>
  );
}
