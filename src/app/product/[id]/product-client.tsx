'use client';

import { useRouter } from 'next/navigation';
import { Wrench, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingCalendar } from '@/components/ui/booking-calendar';
import { useState } from 'react';
import Link from 'next/link';

interface ProductClientProps {
  product: any;
}

export function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();

  const [dateRange, setDateRange] = useState<{start: Date, end: Date} | null>({
    start: new Date(2026, 5, 9),
    end: new Date(2026, 5, 12)
  });

  const duration = dateRange ? Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = duration * product.price_per_day;

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="px-5 py-3 flex items-center gap-1.5 text-[12px] text-gray-400">
        <Link href="/" className="hover:text-gray-600">Главная</Link>
        <span>›</span>
        <Link href={`/catalog?category=${product.categories?.slug}`} className="hover:text-gray-600">{product.categories?.name}</Link>
        <span>›</span>
        <span className="text-gray-600 truncate">{product.name}</span>
      </div>

      <div className="border border-gray-100 rounded-2xl mx-5 overflow-hidden">
        {/* Main Image Area */}
        <div className="h-[220px] bg-gray-50 flex items-center justify-center border-b border-gray-100">
          <Wrench size={72} className="text-gray-300" />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-1.5 p-4 border-b border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-12 h-9 rounded-md border flex items-center justify-center bg-gray-50 cursor-pointer ${i === 1 ? 'border-[#534AB7]' : 'border-gray-100'}`}>
              <Wrench size={16} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* Info Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <span className="inline-block bg-[#EEEDFE] text-[#3C3489] text-[10px] px-2 py-0.5 rounded-md mb-1 font-medium">
              {product.categories?.name}
            </span>
            <h1 className="text-xl font-medium text-gray-900">{product.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-medium text-[#3C3489]">{product.price_per_day} ₽</div>
            <div className="text-[12px] text-gray-400 font-medium">за 1 сутки</div>
          </div>
        </div>

        {/* Pricing Blocks */}
        <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100">
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="text-[11px] text-gray-400 mb-1">Стоимость аренды</div>
            <div className="text-lg font-medium">{product.price_per_day} ₽</div>
            <div className="text-[11px] text-gray-500">за 1 сутки</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="text-[11px] text-gray-400 mb-1">Залог</div>
            <div className="text-lg font-medium">{product.deposit_amount} ₽</div>
            <div className="text-[11px] text-gray-500">возвращается при сдаче</div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-[15px] font-medium mb-2">Описание</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">{product.description}</p>
        </div>

        {/* Calendar */}
        <BookingCalendar onDateChange={setDateRange} />

        {/* CTA Footer */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-[12px] text-gray-500">
              {duration > 0 ? `${duration} суток` : 'Выберите даты'}
            </div>
            <div className="text-base font-medium">
              {totalPrice} ₽ + залог {product.deposit_amount} ₽
            </div>
          </div>
          <Button
            className="px-6 py-2 h-11 gap-2"
            disabled={!dateRange}
            onClick={() => router.push(`/order/confirm?product=${product.id}&start=${dateRange?.start.toISOString()}&end=${dateRange?.end.toISOString()}`)}
          >
            <ShoppingCart size={18} />
            Арендовать
          </Button>
        </div>
      </div>
    </div>
  );
}
