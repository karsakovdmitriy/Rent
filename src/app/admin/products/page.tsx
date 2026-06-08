'use client';

import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_day: '',
    deposit_amount: '',
    category_id: '',
    image_url: '',
    condition: 'Excellent',
    kit_info: ''
  });

  useEffect(() => {
    fetchData();
  }, [supabase]);

  async function fetchData() {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот товар?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price_per_day: product.price_per_day.toString(),
        deposit_amount: product.deposit_amount.toString(),
        category_id: product.category_id,
        image_url: product.image_url || '',
        condition: product.condition || 'Excellent',
        kit_info: product.kit_info || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price_per_day: '',
        deposit_amount: '',
        category_id: categories[0]?.id || '',
        image_url: '',
        condition: 'Excellent',
        kit_info: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price_per_day: parseFloat(formData.price_per_day),
      deposit_amount: parseFloat(formData.deposit_amount),
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(data).eq('id', editingProduct.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('products').insert([data]);
      if (error) alert(error.message);
    }

    setIsModalOpen(false);
    fetchData();
  };

  if (loading && products.length === 0) return <div className="p-10 text-center text-gray-400 text-sm">Загрузка данных...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Управление товарами</h2>
          <p className="text-sm text-gray-500">Добавляйте и редактируйте товары вашего проката</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 bg-[#3C3489] hover:bg-[#2F2970]">
          <Plus size={16} /> Добавить товар
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Товар</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Категория</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Цена/сут</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Залог</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase text-[10px] tracking-wider text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{product.categories?.name}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{product.price_per_day} ₽</td>
                <td className="px-6 py-4 text-gray-500">{product.deposit_amount} ₽</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="p-2 text-gray-400 hover:text-[#3C3489] transition-colors hover:bg-gray-100 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">
                {editingProduct ? 'Редактировать товар' : 'Новый товар'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Название</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                    placeholder="Напр: Перфоратор Bosch"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Категория</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Описание</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  placeholder="Опишите технические характеристики и особенности..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Цена аренды (за сутки)</label>
                  <input
                    required
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Сумма залога</label>
                  <input
                    required
                    type="number"
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({...formData, deposit_amount: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">URL Изображения (Unsplash или ссылка)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Состояние</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  >
                    <option value="Excellent">Отличное</option>
                    <option value="Good">Хорошее</option>
                    <option value="Fair">Удовлетворительное</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Комплектация</label>
                  <input
                    type="text"
                    value={formData.kit_info}
                    onChange={(e) => setFormData({...formData, kit_info: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                    placeholder="Кейс, 2 АКБ, зарядка"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#3C3489] hover:bg-[#2F2970]"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Создать товар'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
