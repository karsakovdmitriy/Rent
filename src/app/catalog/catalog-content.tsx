'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

interface CatalogContentProps {
  initialCategories: any[];
  initialProducts: any[];
}

const productImages: Record<string, string> = {
  'Перфоратор Bosch GBH 2-26': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  'Палатка туристическая 4-местная': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop',
  'Зеркальная камера Sony A7 III': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'Велосипед горный': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
};

export function CatalogContent({ initialCategories, initialProducts }: CatalogContentProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popular'>('popular');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategory !== 'all') {
      const categoryId = initialCategories.find(c => c.slug === activeCategory)?.id;
      if (categoryId) {
        result = result.filter(p => p.category_id === categoryId);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_day - b.price_per_day;
      if (sortBy === 'price_desc') return b.price_per_day - a.price_per_day;
      if (sortBy === 'popular') {
        if (a.is_popular && !b.is_popular) return -1;
        if (!a.is_popular && b.is_popular) return 1;
      }
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy, initialProducts, initialCategories]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Каталог</h1>
          <p className="text-gray-500 font-medium">Выберите лучшее оборудование для ваших задач</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <Filter size={16} />
            <span className="hidden sm:inline">Сортировка:</span>
            <select
              className="bg-transparent outline-none cursor-pointer text-[#3C3489]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Дешевле</option>
              <option value="price_desc">Дороже</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-8">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-4 block">Поиск</label>
            <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-indigo-200 transition-colors">
              <input
                type="text"
                placeholder="Название..."
                className="flex-1 px-4 py-2.5 outline-none text-sm text-gray-900 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="bg-gray-50 border-l border-gray-100 px-3 flex items-center justify-center text-gray-400">
                <Search size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-4 block">Категории</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#3C3489] text-white shadow-lg shadow-indigo-100'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Все товары
              </button>
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-[#3C3489] text-white shadow-lg shadow-indigo-100'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
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
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400 font-bold">Ничего не нашли по вашему запросу</p>
              <button
                onClick={() => {setActiveCategory('all'); setSearchQuery('');}}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
