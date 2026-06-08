'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
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

  if (!product) return <div className="p-20 text-center font-bold text-gray-400">Подготовка данных...</div>;

  const startDate = startStr ? new Date(startStr) : new Date();
  const endDate = endStr ? new Date(endStr) : new Date();

  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const rentPrice = duration * product.price_per_day;
  const totalWithDeposit = rentPrice + product.deposit_amount;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
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
          clientName: user?.user_metadata?.full_name || 'Гость',
          clientPhone: user?.phone || '+7 (999) 000-00-00'
        })
      });

      router.push(`/order/success?id=${order.id}`);
    } catch (e: any) {
      alert('Ошибка при оформлении: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-black mb-1 text-gray-900">Проверьте данные</h2>
           <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold">Шаг 2 из 2: Оформление</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-gray-400">
          <ArrowLeft size={16} /> Назад
        </Button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-100 mb-8">
        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
          <ShoppingCart size={20} className="text-indigo-600" />
          Детали заявки
        </h3>

        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-sm pb-3 border-b border-gray-50">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Товар</span>
            <span className="font-black text-right ml-4 text-gray-900">{product.name}</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-50">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Период</span>
            <span className="font-black text-gray-900">{format(startDate, 'dd.MM')} — {format(endDate, 'dd.MM.yyyy')}</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-50">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Длительность</span>
            <span className="font-black text-gray-900">{duration} суток</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-50">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Стоимость аренды</span>
            <span className="font-black text-indigo-600">{rentPrice} ₽</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-50">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Сумма залога</span>
            <span className="font-black text-gray-900">{product.deposit_amount} ₽</span>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-2xl flex justify-between items-center mb-10 border border-indigo-100">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">К оплате при получении:</span>
            <strong className="text-3xl font-black text-[#3C3489]">{totalWithDeposit} ₽</strong>
          </div>
          <Wallet className="text-indigo-200" size={40} />
        </div>

        <div className="bg-amber-50 p-4 rounded-xl mb-10 flex gap-3 items-start border border-amber-100">
          <CreditCard className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[12px] text-amber-800 font-bold leading-snug">
            Предоплата не требуется. Оплата производится при получении товара и проверке его состояния.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 h-14 rounded-xl font-bold border-gray-100 text-gray-400" onClick={() => router.back()}>Отмена</Button>
          <Button className="flex-[2] h-14 rounded-xl font-black text-lg gap-2 shadow-xl shadow-indigo-100" onClick={handleConfirm} disabled={loading}>
            <Check size={20} strokeWidth={3} /> {loading ? 'Оформляем...' : 'Подтвердить заказ'}
          </Button>
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest px-8">
        Нажимая кнопку, вы соглашаетесь с условиями проката и обработки персональных данных
      </p>
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
