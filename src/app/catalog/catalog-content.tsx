'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { Wrench, Search, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface CatalogContentProps {
  initialCategories: any[];
  initialProducts: any[];
}

export function CatalogContent({ initialCategories, initialProducts }: CatalogContentProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popular'>('popular');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (activeCategory !== 'all') {
      const categoryId = initialCategories.find(c => c.slug === activeCategory)?.id;
      if (categoryId) {
        result = result.filter(p => p.category_id === categoryId);
      }
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sort
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
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-medium">Каталог товаров</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <ArrowUpDown size={14} />
          <select
            className="bg-transparent outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="popular">По популярности</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
          </select>
        </div>
      </div>

      <div className="flex max-w-md mb-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <input
          type="text"
          placeholder="Поиск по названию..."
          className="flex-1 px-4 py-2 outline-none text-sm text-gray-900"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="bg-gray-50 border-l border-gray-100 px-3 flex items-center justify-center text-gray-400">
          <Search size={18} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#3C3489] text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Все
        </button>
        {initialCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-[#3C3489] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price_per_day}
              deposit={product.deposit_amount}
              icon={Wrench}
              badge={product.is_popular ? 'Хит' : product.is_new ? 'Новинка' : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400">Товары не найдены</p>
        </div>
      )}
    </>
  );
}
