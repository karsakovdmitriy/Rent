import Link from 'next/link';
import { LayoutDashboard, List, Package, FolderTree, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Панель', icon: LayoutDashboard, href: '/admin' },
  { name: 'Заказы', icon: List, href: '/admin/orders', active: true },
  { name: 'Товары', icon: Package, href: '/admin/products' },
  { name: 'Категории', icon: FolderTree, href: '/admin/categories' },
  { name: 'Клиенты', icon: Users, href: '/admin/users' },
  { name: 'Настройки', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  return (
    <aside className="w-full md:w-48 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm self-start">
      <div className="p-4 border-b border-gray-50 flex items-center gap-2 text-sm font-medium text-[#3C3489]">
        <LayoutDashboard size={16} /> Панель
      </div>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-5 py-3 text-[13px] transition-colors border-b border-gray-50",
              item.active ? "bg-[#EEEDFE] text-[#3C3489] font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <item.icon size={16} /> {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
