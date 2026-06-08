import { createClient } from '@/utils/supabase/server';
import { AdminSidebar } from '@/components/admin/sidebar';

const stats = [
  { label: 'Заказов сегодня', val: '7', sub: '+2 к вчераш.', color: 'text-gray-900', key: 'today_orders' },
  { label: 'На рассмотрении', val: '3', sub: 'требуют обработки', color: 'text-gray-900', key: 'pending_orders' },
  { label: 'В аренде', val: '12', sub: 'активных', color: 'text-gray-900', key: 'active_orders' },
  { label: 'Клиентов', val: '284', sub: 'всего', color: 'text-gray-900', key: 'total_clients' },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Real stats fetching
  const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: activeCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  const today = new Date().toISOString().split('T')[0];
  const { count: todayCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today);

  const displayStats = [
    { ...stats[0], val: String(todayCount || 0) },
    { ...stats[1], val: String(pendingCount || 0) },
    { ...stats[2], val: String(activeCount || 0) },
    { ...stats[3], val: String(clientCount || 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-[11px] text-gray-400 uppercase font-medium mb-1.5">{stat.label}</div>
            <div className={`text-2xl font-medium ${stat.color}`}>{stat.val}</div>
            <div className="text-[11px] text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm">
        Добро пожаловать в панель управления. Используйте меню слева для управления контентом и заказами.
      </div>
    </div>
  );
}
