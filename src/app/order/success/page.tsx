'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [managerName, setManagerName] = useState('Дмитрий');
  const [callTime, setCallTime] = useState('');

  useEffect(() => {
    // Determine call back estimate (within 1 hour)
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setCallTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  return (
    <div className="px-5 py-20 max-w-xl mx-auto text-center">
      <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full text-green-500 shadow-inner">
        <CheckCircle2 size={56} strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Заявка №{orderId || '...'} принята!</h1>

      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl mb-10 text-left">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 mb-1">Ожидайте звонка</h3>
            <p className="text-sm text-gray-500 font-medium">Наш менеджер <span className="text-gray-900 font-bold">{managerName}</span> позвонит вам до <span className="text-[#3C3489] font-black">{callTime}</span> для подтверждения деталей.</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Статус: На рассмотрении</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg gap-2" asChild>
          <Link href="/profile">
            В личный кабинет <ArrowRight size={20} />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl font-bold border-gray-200" asChild>
          <Link href="/">
            <Home size={18} className="mr-2" /> На главную
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
