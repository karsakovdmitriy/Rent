'use client';

import { List, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const statusStyles = {
  pending: 'bg-[#FAEEDA] text-[#633806]',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-[#FCEBEB] text-[#791F1F]',
  confirmed: 'bg-[#EAF3DE] text-[#27500A]',
  active: 'bg-[#EEEDFE] text-[#3C3489]'
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
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profile);

      const { data: orders } = await supabase
        .from('orders')
        .select('*, products(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
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

  if (loading) return <div className="p-20 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="px-5 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-sm self-start">
          <div className="p-6 text-center border-b border-gray-50">
            <div className="w-12 h-12 bg-[#EEEDFE] text-[#3C3489] rounded-full flex items-center justify-center text-lg font-medium mx-auto mb-3 uppercase">
              {profile?.full_name?.[0] || user?.phone?.[1] || 'U'}
            </div>
            <h2 className="text-sm font-medium">{profile?.full_name || 'Клиент'}</h2>
            <p className="text-[12px] text-gray-400">{user?.phone || user?.email}</p>
          </div>

          <nav className="flex flex-col">
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                "flex items-center gap-3 px-5 py-3 text-sm transition-colors border-b border-gray-50",
                activeTab === 'orders' ? "bg-[#EEEDFE] text-[#3C3489] font-medium" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <List size={18} /> Мои заказы
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 px-5 py-3 text-sm transition-colors border-b border-gray-50",
                activeTab === 'profile' ? "bg-[#EEEDFE] text-[#3C3489] font-medium" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <UserIcon size={18} /> Профиль
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={18} /> Выйти
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-4">
          {activeTab === 'orders' ? (
            <>
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[13px] font-medium">Заявка № {order.id}</div>
                      <div className="text-[11px] text-gray-400">Создана {new Date(order.created_at).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <span className={cn("text-[11px] px-2.5 py-1 rounded-md font-medium", statusStyles[order.status as keyof typeof statusStyles])}>
                      {statusTexts[order.status as keyof typeof statusTexts]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[13px] font-medium">{order.products?.name}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-500">
                      <span>{new Date(order.start_date).toLocaleDateString('ru-RU')} — {new Date(order.end_date).toLocaleDateString('ru-RU')}</span>
                      <span>Аренда: <strong className="text-gray-900">{order.total_price} ₽</strong></span>
                      <span>Залог: <strong className="text-gray-900">{order.deposit_amount} ₽</strong></span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                  У вас пока нет заказов
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-6">Данные профиля</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Имя</label>
                  <p className="text-sm border-b border-gray-50 py-1">{profile?.full_name || 'Не указано'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Телефон</label>
                  <p className="text-sm border-b border-gray-50 py-1">{user?.phone || 'Не указан'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Email</label>
                  <p className="text-sm border-b border-gray-50 py-1">{user?.email || 'Не указан'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
