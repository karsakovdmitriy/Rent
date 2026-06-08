'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, CheckCircle2, Package, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingCalendar } from '@/components/ui/booking-calendar';
import { useState } from 'react';
import Link from 'next/link';

interface ProductClientProps {
  product: any;
}

const productImages: Record<string, string> = {
  'Перфоратор Bosch GBH 2-26': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
  'Палатка туристическая 4-местная': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop',
  'Зеркальная камера Sony A7 III': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
  'Велосипед горный': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
};

export function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{start: Date, end: Date} | null>({
    start: new Date(2026, 5, 9),
    end: new Date(2026, 5, 12)
  });

  const duration = dateRange ? Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = duration * product.price_per_day;
  const pricePerDayLong = Math.round(product.price_per_day * 0.8); // Psychological pricing example

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="px-5 py-4 flex items-center gap-1.5 text-[12px] text-gray-400 font-bold uppercase tracking-wider">
        <Link href="/" className="hover:text-gray-900 transition-colors">Главная</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.categories?.slug}`} className="hover:text-gray-900 transition-colors">{product.categories?.name}</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </div>

      <div className="px-5 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
            <img
              src={productImages[product.name]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-lg">Как новый</span>
              {product.is_popular && <span className="bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-lg">Хит проката</span>}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${i === 1 ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-gray-200'}`}>
                <img src={productImages[product.name]} className="w-full h-full object-cover opacity-80" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#3C3489]">{product.price_per_day} ₽</span>
                <span className="text-sm text-gray-400 font-bold uppercase tracking-tighter">/ сутки</span>
              </div>
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
                ~{pricePerDayLong} ₽/день при аренде от 3 суток
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Залог</div>
              <div className="text-xl font-black text-gray-900">{product.deposit_amount} ₽</div>
              <div className="text-[10px] text-gray-400 font-medium mt-1">Возвращаем сразу при сдаче</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Состояние</div>
              <div className="flex items-center gap-1.5 text-green-600 font-black">
                <CheckCircle2 size={16} />
                <span>Отличное</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium mt-1">Регулярно обслуживаем</div>
            </div>
          </div>

          <div className="space-y-8 mb-10">
            <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Package size={18} />
                   Что в комплекте
                 </h3>
                 <ul className="grid grid-cols-1 gap-2 text-indigo-100 text-[13px] font-medium">
                   <li className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                     Основное устройство
                   </li>
                   <li className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                     Защитный кейс для переноски
                   </li>
                   <li className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                     Инструкция по эксплуатации
                   </li>
                   <li className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                     Расходники (опционально)
                   </li>
                 </ul>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-900">
                <Info size={18} />
                Описание
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-2">Выберите даты аренды</h2>
              <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em]">Проверьте доступность в календаре</p>
           </div>

           <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
             <BookingCalendar onDateChange={setDateRange} />

             <div className="p-8 md:p-12 bg-[#3C3489] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                   <div className="text-indigo-200 font-bold uppercase text-[11px] tracking-widest mb-2">
                     {duration > 0 ? `Период: ${duration} суток` : 'Укажите даты выше'}
                   </div>
                   <div className="text-4xl font-black">
                     {totalPrice} ₽ <span className="text-xl text-indigo-300 font-medium">+ {product.deposit_amount} ₽ залог</span>
                   </div>
                </div>
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-lg gap-3 shadow-xl"
                  disabled={!dateRange}
                  onClick={() => router.push(`/order/confirm?product=${product.id}&start=${dateRange?.start.toISOString()}&end=${dateRange?.end.toISOString()}`)}
                >
                  <ShoppingCart size={22} strokeWidth={3} />
                  Забронировать сейчас
                </Button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
