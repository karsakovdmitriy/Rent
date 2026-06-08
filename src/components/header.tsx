import Link from 'next/link';
import { User, Phone } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <div className="w-2.5 h-2.5 bg-[#3C3489] rounded-full" />
          ПрокатМаркет
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Каталог</Link>
          <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Условия</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <Phone size={14} />
          <span className="text-xs font-semibold text-gray-900">+7 (495) 123-45-67</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <User size={16} />
              <span className="hidden sm:inline">Кабинет</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="primary" size="sm" className="hidden md:flex h-9 shadow-sm">
              Админка
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
