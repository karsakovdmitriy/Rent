import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 text-[17px] font-medium text-[#111827]">
        <div className="w-2 h-2 bg-[#3C3489] rounded-full" />
        ПрокатМаркет
      </Link>

      <nav className="hidden md:flex items-center gap-5">
        <Link href="/catalog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Каталог</Link>
        <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Условия</Link>
        <Link href="/contacts" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Контакты</Link>
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/auth">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <User size={16} />
            Войти
          </Button>
          <Button variant="outline" size="sm" className="flex sm:hidden p-2">
            <User size={16} />
          </Button>
        </Link>
      </div>
    </header>
  );
}
