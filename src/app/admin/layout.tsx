import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Admin Topbar */}
      <header className="bg-[#26215C] px-5 py-3.5 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-2 text-[#EEEDFE] font-medium text-sm">
          <div className="w-2 h-2 bg-[#AFA9EC] rounded-full" />
          ПрокатМаркет — Админ
        </div>
        <div className="text-[12px] text-[#AFA9EC]">Администратор</div>
      </header>

      <div className="px-5 py-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
