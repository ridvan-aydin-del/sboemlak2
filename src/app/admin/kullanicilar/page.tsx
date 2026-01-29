"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Profile, UserRole } from "@/types/profile";

export default function AdminKullanicilarPage() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    void fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabaseBrowserClient
      .from("sbo_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUsers((data ?? []) as Profile[]);
  };

  const handleRoleChange = async (id: string, role: UserRole) => {
    const { error } = await supabaseBrowserClient
      .from("sbo_profiles")
      .update({ role })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    void fetchUsers();
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Kullanıcılar</h1>
        <p className="text-xs text-slate-600">
          Tüm kullanıcıları görüntüleyebilir ve rollerini admin, satış elemanı
          veya müşteri olarak güncelleyebilirsiniz.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Ad Soyad</th>
              <th className="px-3 py-2">Kullanıcı ID</th>
              <th className="px-3 py-2">Rol</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Oluşturulma</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-800">
                  {user.full_name || "-"}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                  {user.id}
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={user.role}
                    onChange={(e) =>
                      void handleRoleChange(user.id, e.target.value as UserRole)
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="satis-elemani">Satış Elemanı</option>
                    <option value="musteri">Müşteri</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {user.whatsapp_number || "-"}
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-xs text-slate-500"
                >
                  Henüz profil kaydı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

