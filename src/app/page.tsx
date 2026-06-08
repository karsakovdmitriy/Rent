import { createClient } from '@/utils/supabase/server';
import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HowItWorks } from "@/components/home/how-it-works";

export default async function Home() {
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*');
  const { data: popularProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_popular', true)
    .limit(3);

  return (
    <div className="flex flex-col">
      <Hero />
      <Categories categories={categories || []} />
      <FeaturedProducts products={popularProducts || []} />
      <HowItWorks />
    </div>
  );
}
