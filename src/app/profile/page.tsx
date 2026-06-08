'use client';

import { List, User as UserIcon, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-gray-100 text-gray-500 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  active: 'bg-indigo-50 text-indigo-700 border-indigo-200'
};

const statusTexts = {
  pending: 'На рассмотрении',
  confirmed: 'Подтверждён',
  active: 'В аренде',
  completed: 'Завершён',
  cancelled: 'Отменён'
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const userId = user?.id;
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
        setProfile(profile);
      }

      const query = supabase
        .from('orders')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (userId) {
        query.eq('user_id', userId);
      }

      const { data: orders } = await query;
      setOrders(orders || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest">Загрузка кабинета...</div>;

  return (
    <div className="px-5 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex flex-col bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-2xl shadow-gray-100 self-start">
          <div className="p-8 text-center border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 border-4 border-white shadow-inner uppercase">
              {profile?.full_name?.[0] || user?.phone?.[1] || 'T'}
            </div>
            <h2 className="text-xl font-black text-gray-900">{profile?.full_name || user?.phone ? 'Алексей Иванов' : 'Тестовый Клиент'}</h2>
            <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{user?.phone || '+7 (999) 000-00-00'}</p>
          </div>

          <nav className="flex flex-col p-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm transition-all",
                activeTab === 'orders' ? "bg-indigo-50 text-indigo-700 font-black shadow-sm" : "text-gray-400 font-bold hover:bg-gray-50"
              )}
            >
              <List size={20} /> Мои заказы
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm transition-all",
                activeTab === 'profile' ? "bg-indigo-50 text-indigo-700 font-black shadow-sm" : "text-gray-400 font-bold hover:bg-gray-50"
              )}
            >
              <UserIcon size={20} /> Профиль
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm text-gray-400 font-bold hover:bg-red-50 hover:text-red-500 transition-all mt-2"
            >
              <LogOut size={20} /> Выйти
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {activeTab === 'orders' ? (
            <>
              <div className="flex justify-between items-center mb-2">
                 <h1 className="text-3xl font-black">Ваши заявки</h1>
                 <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{orders.length} всего</span>
              </div>
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xl shadow-gray-50 transition-all hover:translate-x-1 border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-black text-gray-900">Заявка №{order.id}</div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Оформлена {new Date(order.created_at).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <span className={cn("text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border", statusStyles[order.status as keyof typeof statusStyles])}>
                      {statusTexts[order.status as keyof typeof statusTexts]}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                    <div className="text-sm font-black text-gray-900 mb-1">{order.products?.name}</div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-gray-500 font-medium">
                      <span>{new Date(order.start_date).toLocaleDateString('ru-RU')} — {new Date(order.end_date).toLocaleDateString('ru-RU')}</span>
                      <span>Аренда: <strong className="text-indigo-600 font-black">{order.total_price} ₽</strong></span>
                      <span>Залог: <strong className="text-gray-900 font-black">{order.deposit_amount} ₽</strong></span>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <MessageSquare size={16} />
                      <span className="text-xs font-bold leading-none">Ожидайте звонка менеджера для подтверждения</span>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 text-gray-300 font-black text-sm uppercase tracking-widest">
                  У вас пока нет активных заявок
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-2xl shadow-gray-50">
              <h3 className="text-2xl font-black mb-10">Данные профиля</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Ваше Имя</label>
                    <p className="text-lg font-black border-b-2 border-gray-50 pb-2">{profile?.full_name || 'Алексей Иванов'}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Номер телефона</label>
                    <p className="text-lg font-black border-b-2 border-gray-50 pb-2">{user?.phone || '+7 (999) 000-00-00'}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">E-mail адрес</label>
                    <p className="text-lg font-black border-b-2 border-gray-50 pb-2">{user?.email || 'test@example.com'}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Дата регистрации</label>
                    <p className="text-lg font-black border-b-2 border-gray-50 pb-2">12.05.2024</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">Редактировать данные</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
