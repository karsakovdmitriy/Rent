import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="bg-gray-50 py-12 px-5 text-center border-b border-gray-100">
      <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mb-2 font-medium">Аренда любых товаров</p>
      <h1 className="text-[28px] font-medium text-gray-900 mb-3 leading-tight">
        Возьмите в аренду<br />то, что нужно прямо сейчас
      </h1>
      <p className="text-gray-500 mb-6 max-w-[460px] mx-auto text-base leading-relaxed">
        Широкий каталог — от инструментов до туристического снаряжения. Оставьте заявку, мы свяжемся в течение часа.
      </p>

      <div className="flex max-w-[440px] mx-auto mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <input
          type="text"
          placeholder="Найти товар... например, перфоратор"
          className="flex-1 px-4 py-2.5 outline-none text-sm text-gray-900"
        />
        <button className="bg-[#3C3489] text-white px-4 flex items-center justify-center hover:bg-[#26215C] transition-colors">
          <Search size={18} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" asChild>
          <a href="/catalog">Смотреть каталог</a>
        </Button>
        <Button variant="outline">Как это работает</Button>
      </div>
    </section>
  );
}
