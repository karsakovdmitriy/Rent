'use client';

import { Button } from '@/components/ui/button';
import { Save, Bell, Shield, Info } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Настройки системы</h2>

      <div className="grid gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-[#3C3489] font-medium border-b border-gray-50 pb-4">
            <Bell size={20} /> Уведомления Telegram
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Token Бота</label>
                <input
                  type="password"
                  value="***************************"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Chat ID Менеджера</label>
                <input
                  type="text"
                  value="123456789"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5 italic">
              <Info size={12} /> Настройки Telegram задаются через переменные окружения на хостинге.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-[#3C3489] font-medium border-b border-gray-50 pb-4">
            <Shield size={20} /> Безопасность и Доступ
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-amber-900">Тестовый режим (Open Access)</h4>
                <p className="text-xs text-amber-700">В данный момент проверка авторизации отключена для удобства тестирования.</p>
              </div>
              <div className="w-10 h-5 bg-amber-400 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button className="bg-[#3C3489] hover:bg-[#2F2970] gap-2 px-8">
          <Save size={16} /> Сохранить настройки
        </Button>
      </div>
    </div>
  );
}
