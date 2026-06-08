import { ProductCard } from '@/components/ui/product-card';

const productImages: Record<string, string> = {
  'Перфоратор Bosch GBH 2-26': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  'Палатка туристическая 4-местная': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop',
  'Зеркальная камера Sony A7 III': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'Велосипед горный': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
};

export function FeaturedProducts({ products }: { products: any[] }) {
  return (
    <section className="px-5 py-12 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[13px] uppercase tracking-widest text-gray-400 font-bold">Популярные товары</h2>
        <div className="h-[1px] flex-1 bg-gray-100 mx-6" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price_per_day}
            deposit={product.deposit_amount}
            img={productImages[product.name]}
            badge={product.is_popular ? 'Хит' : product.is_new ? 'Новинка' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
