'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const statusStyles = {
  pending: 'bg-[#FAEEDA] text-[#633806]',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-[#FCEBEB] text-[#791F1F]',
  confirmed: 'bg-[#EAF3DE] text-[#27500A]',
  active: 'bg-[#EEEDFE] text-[#3C3489]'
};

const statusTexts = {
  pending: 'На рассм.',
  confirmed: 'Подтверждён',
  active: 'В аренде',
  completed: 'Завершён',
  cancelled: 'Отменён'
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*, products(name), profiles(full_name, phone)')
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Управление заказами</h2>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">№</th>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Товар</th>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Клиент</th>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Период</th>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Сумма</th>
                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-[10px] tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">#{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.products?.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{order.profiles?.full_name || 'Клиент'}</div>
                    <div className="text-[11px] text-gray-400">{order.profiles?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-[12px]">
                    {new Date(order.start_date).toLocaleDateString('ru-RU')}–{new Date(order.end_date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.total_price} ₽</td>
                  <td className="px-6 py-4">
                    <select
                      className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium outline-none cursor-pointer border-none", statusStyles[order.status as keyof typeof statusStyles])}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {Object.entries(statusTexts).map(([val, label]) => (
                        <option key={val} value={val} className="bg-white text-gray-900">{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
