import { Wrench, Tent, Bike, Camera, Gamepad2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/product-card';

const iconMap: Record<string, any> = {
  'tools': Wrench,
  'tourism': Tent,
  'transport': Bike,
  'photo-video': Camera,
  'entertainment': Gamepad2,
};

export function FeaturedProducts({ products }: { products: any[] }) {
  return (
    <section className="px-5 py-8 bg-white">
      <h2 className="text-[12px] uppercase tracking-wider text-gray-400 font-medium mb-4">Популярные товары</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price_per_day}
            deposit={product.deposit_amount}
            icon={Wrench} // Fallback to Wrench as dynamic icons are harder with DB slugs
            badge={product.is_popular ? 'Хит' : product.is_new ? 'Новинка' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
