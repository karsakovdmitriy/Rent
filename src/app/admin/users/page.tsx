'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, Phone, Mail } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  if (loading) return <div className="p-10 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Зарегистрированные пользователи</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((profile) => (
          <div key={profile.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-[#3C3489]">
                <User size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{profile.full_name || 'Без имени'}</h4>
                  {profile.is_admin && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <Shield size={10} /> ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">ID: {profile.id.substring(0, 8)}...</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" />
                <span>{profile.phone || 'Нет телефона'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" />
                <span>{profile.email || 'Нет почты'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
