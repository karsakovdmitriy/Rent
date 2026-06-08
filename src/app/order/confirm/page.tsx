'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Suspense, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const productId = searchParams.get('product');
  const startStr = searchParams.get('start');
  const endStr = searchParams.get('end');

  useEffect(() => {
    async function fetchData() {
      if (!productId) return;
      const { data } = await supabase.from('products').select('*').eq('id', productId).single();
      setProduct(data);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchData();
  }, [productId, supabase]);

  if (!product) return <div className="p-20 text-center">Загрузка...</div>;

  const startDate = startStr ? new Date(startStr) : new Date();
  const endDate = endStr ? new Date(endStr) : new Date();

  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const rentPrice = duration * product.price_per_day;
  const totalWithDeposit = rentPrice + product.deposit_amount;

  const handleConfirm = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in DB
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_id: product.id,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          total_price: rentPrice,
          deposit_amount: product.deposit_amount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Send Telegram notification
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          productName: product.name,
          startDate: format(startDate, 'dd.MM.yyyy'),
          endDate: format(endDate, 'dd.MM.yyyy'),
          duration,
          totalPrice: rentPrice,
          depositAmount: product.deposit_amount,
          clientName: user.user_metadata?.full_name || 'Клиент',
          clientPhone: user.phone || 'Не указан'
        })
      });

      router.push('/profile?order=success');
    } catch (e: any) {
      alert('Ошибка при оформлении: ' + e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-medium">Подтверждение заказа</h2>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
          <ArrowLeft size={14} /> Назад
        </Button>
      </div>

      <div className="bg-gray-400/20 backdrop-blur-sm p-5 md:p-10 rounded-3xl flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl w-full max-w-sm">
          <h3 className="text-base font-medium mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#534AB7]" />
            Оформление заявки
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-400">Товар</span>
              <span className="font-medium text-right ml-4">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-400">Период</span>
              <span className="font-medium">{format(startDate, 'dd.MM')} — {format(endDate, 'dd.MM.yyyy')}</span>
            </div>
            <div className="flex justify-between text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-400">Длительность</span>
              <span className="font-medium">{duration} суток</span>
            </div>
            <div className="flex justify-between text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-400">Стоимость аренды</span>
              <span className="font-medium">{rentPrice} ₽</span>
            </div>
            <div className="flex justify-between text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-400">Залог</span>
              <span className="font-medium">{product.deposit_amount} ₽</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Итого к оплате:</span>
            <strong className="text-lg font-medium">{totalWithDeposit} ₽</strong>
          </div>

          <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
            Менеджер свяжется с вами по номеру <span className="font-medium text-gray-600">{user?.phone || '+7 (•••) ••• ••-••'}</span> для согласования оплаты и доставки
          </p>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>Отмена</Button>
            <Button className="flex-1 gap-1" onClick={handleConfirm} disabled={loading}>
              <Check size={16} /> {loading ? '...' : 'Подтвердить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
