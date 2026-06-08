'use client';

import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*, categories(name)');
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот товар?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Управление товарами</h2>
        <Button size="sm" className="gap-2">
          <Plus size={16} /> Добавить товар
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Название</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Категория</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Цена/сут</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-500">{product.categories?.name}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{product.price_per_day} ₽</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-[#3C3489] transition-colors">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
