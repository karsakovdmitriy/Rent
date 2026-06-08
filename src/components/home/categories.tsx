import { Wrench, Tent, Bike, Camera, Gamepad2, LucideIcon } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, LucideIcon> = {
  'tool': Wrench,
  'tent': Tent,
  'bike': Bike,
  'camera': Camera,
  'device-gamepad': Gamepad2,
};

interface CategoriesProps {
  categories: any[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section className="px-5 py-8">
      <h2 className="text-[12px] uppercase tracking-wider text-gray-400 font-medium mb-4">Популярные категории</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Wrench;
          return (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-[#3C3489] transition-all hover:shadow-sm"
            >
              <div className="text-[#534AB7] mb-2 flex justify-center">
                <Icon size={24} />
              </div>
              <div className="text-[12px] text-gray-500 font-medium">{category.name}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
