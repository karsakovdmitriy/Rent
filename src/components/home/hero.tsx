import { Search, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - 2021;

  return (
    <section className="relative bg-white py-16 px-5 border-b border-gray-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/30 -skew-x-12 translate-x-1/2 z-0" />

      <div className="relative z-10 text-center md:text-left max-w-2xl mx-auto md:mx-0">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
          <ShieldCheck size={14} />
          Связываемся в течение часа. Доставка по городу
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
          Перфоратор на выходные — <span className="text-[#3C3489]">без покупки</span> и лишних трат
        </h1>

        <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">
          Берите дорогой инструмент на день — платите только за время использования. Уже <span className="text-gray-900 font-bold">500+</span> успешных аренд.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 flex max-w-md border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-indigo-200 transition-colors">
            <input
              type="text"
              placeholder="Что ищете? Например, палатка"
              className="flex-1 px-4 py-3 outline-none text-sm text-gray-900 font-medium"
            />
            <button className="bg-[#3C3489] text-white px-5 flex items-center justify-center hover:bg-[#26215C] transition-colors">
              <Search size={20} />
            </button>
          </div>
          <Button variant="primary" size="lg" className="h-[52px] px-8 text-base shadow-lg shadow-indigo-200" asChild>
            <Link href="/catalog">Смотреть каталог</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-xs font-bold text-gray-900">4.9/5 рейтинг</span>
          </div>
          <div className="text-xs font-medium">Работаем уже {yearsActive} года</div>
        </div>
      </div>
    </section>
  );
}
