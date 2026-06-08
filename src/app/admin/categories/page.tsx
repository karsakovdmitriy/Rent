'use client';

import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту категорию? Товары в ней могут перестать отображаться правильно.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert('Ошибка: возможно, в этой категории есть товары. Сначала удалите или переместите их.');
    } else {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([{
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      image_url: imageUrl
    }]);

    if (error) {
      alert(error.message);
    } else {
      setIsModalOpen(false);
      setName('');
      setSlug('');
      setImageUrl('');
      fetchCategories();
    }
  };

  if (loading && categories.length === 0) return <div className="p-10 text-center text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Управление категориями</h2>
          <p className="text-sm text-gray-500">Группируйте ваши товары для удобного поиска</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-[#3C3489] hover:bg-[#2F2970]">
          <Plus size={16} /> Добавить категорию
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                {category.image_url ? (
                  <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 uppercase font-bold text-xs">
                    {category.name.substring(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-[10px] text-gray-400 font-mono">{category.slug}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Новая категория</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Название</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  placeholder="Напр: Инструменты"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Slug (необязательно)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  placeholder="tools"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">URL Изображения</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3C3489]/20 focus:border-[#3C3489]"
                  placeholder="https://..."
                />
              </div>
              <div className="pt-2 flex gap-3">
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
                  Создать
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
