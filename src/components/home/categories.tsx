import Link from 'next/link';

const categoryData: Record<string, { img: string, count: string, isHot?: boolean }> = {
  'tools': { img: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=200&h=200&fit=crop', count: '34 товара', isHot: true },
  'tourism': { img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop', count: '18 товаров', isHot: true },
  'transport': { img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=200&fit=crop', count: '12 товаров' },
  'photo-video': { img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop', count: '21 товар' },
  'entertainment': { img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop', count: '9 товаров' },
};

interface CategoriesProps {
  categories: any[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section className="px-5 py-12">
      <h2 className="text-[13px] uppercase tracking-widest text-gray-400 font-bold mb-6">Категории проката</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const info = categoryData[category.slug] || { img: '', count: '0 товаров' };
          return (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-300 transition-all hover:shadow-xl"
            >
              <div className="aspect-square w-full relative overflow-hidden bg-gray-50">
                <img
                  src={info.img}
                  alt={category.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 opacity-90"
                />
                {info.isHot && (
                  <span className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    Хит
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-[14px] text-gray-900 font-bold mb-0.5">{category.name}</div>
                <div className="text-[11px] text-gray-400 font-medium">{info.count}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
