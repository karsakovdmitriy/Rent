import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  deposit: number;
  img?: string;
  badge?: string;
}

export function ProductCard({ id, name, price, deposit, img, badge }: ProductCardProps) {
  const fallbackImg = 'https://images.unsplash.com/photo-1572910358198-27311764491c?w=400&h=300&fit=crop';

  return (
    <Link href={`/product/${id}`} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full border-b-2 hover:border-indigo-400">
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        <img
          src={img || fallbackImg}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-[#3C3489] text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-700 transition-colors">{name}</h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <div className="text-xl font-black text-[#3C3489]">{price} ₽</div>
            <div className="text-xs text-gray-400 font-medium">/ сутки</div>
          </div>
          <div className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Залог: {deposit} ₽</div>
        </div>
      </div>
    </Link>
  );
}
