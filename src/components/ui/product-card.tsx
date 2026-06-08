import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  deposit: number;
  icon: LucideIcon;
  badge?: string;
}

export function ProductCard({ id, name, price, deposit, icon: Icon, badge }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
        <Icon size={40} className="text-gray-300" />
      </div>
      <div className="p-3">
        {badge && (
          <span className="inline-block bg-[#EEEDFE] text-[#3C3489] text-[10px] px-2 py-0.5 rounded-md mb-1 font-medium">
            {badge}
          </span>
        )}
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{name}</h3>
        <div className="text-[13px] text-[#534AB7] font-medium">{price} ₽ / сутки</div>
        <div className="text-[11px] text-gray-400">Залог: {deposit} ₽</div>
      </div>
    </Link>
  );
}
