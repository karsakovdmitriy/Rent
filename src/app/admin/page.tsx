import { createClient } from '@/utils/supabase/server';
import { Package, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: activeCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { data: recentOrders } = await supabase.from('orders').select('*, products(name)').order('created_at', { ascending: false }).limit(5);

  const displayStats = [
    { label: 'Новые заявки', val: String(pendingCount || 0), sub: 'Требуют внимания', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'В аренде', val: String(activeCount || 0), sub: 'Активные контракты', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Клиенты', val: String(clientCount || 0), sub: 'Всего в базе', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Оборот', val: '—', sub: 'За последние 30 дней', icon: TrendingUp, color: 'text-gray-900', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-black text-gray-900">Дашборд</h1>
         <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">Обновлено: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xl shadow-gray-50 flex items-start gap-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
               <stat.icon size={24} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{stat.label}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] text-gray-400 font-bold mt-1 leading-tight">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900">Последние заявки</h2>
              <Link href="/admin/orders" className="text-xs font-black text-[#3C3489] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Все заказы <ArrowRight size={14} />
              </Link>
           </div>

           <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-2xl shadow-gray-50">
             {recentOrders && recentOrders.length > 0 ? (
               <div className="divide-y divide-gray-50">
                 {recentOrders.map((order) => (
                   <div key={order.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xs text-gray-400">#{order.id}</div>
                        <div>
                          <div className="text-sm font-black text-gray-900">{order.products?.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()} · {order.total_price} ₽</div>
                        </div>
                     </div>
                     <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
                       {order.status === 'pending' ? 'Новая' : 'В работе'}
                     </span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-20 text-center text-gray-300 font-black text-xs uppercase tracking-[0.2em]">Нет недавних заявок</div>
             )}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-black text-gray-900">Действия</h2>
           <div className="grid gap-4">
             <Link href="/admin/products" className="bg-[#3C3489] text-white p-6 rounded-3xl font-black text-sm flex items-center justify-between shadow-xl shadow-indigo-100 group">
                Добавить товар
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform"><ArrowRight size={16} /></div>
             </Link>
             <Link href="/admin/categories" className="bg-white text-gray-900 p-6 rounded-3xl font-black text-sm flex items-center justify-between shadow-xl shadow-gray-50 border border-gray-100 group">
                Управление категориями
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
             </Link>
           </div>

           {pendingCount && pendingCount > 0 && (
             <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl animate-pulse">
                <div className="text-amber-700 font-black text-sm mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} /> Очередь
                </div>
                <div className="text-amber-800 font-medium text-xs mb-4">{pendingCount} заявка ждёт обработки</div>
                <Link href="/admin/orders?status=pending" className="inline-block bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                  Рассмотреть
                </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
