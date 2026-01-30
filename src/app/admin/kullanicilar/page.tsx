"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Profile, UserRole } from "@/types/profile";

export default function AdminKullanicilarPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [whatsappLinks, setWhatsappLinks] = useState<Array<{ name: string; url: string }>>([]);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeStep, setRemoveStep] = useState<"confirm" | "transfer">("confirm");
  const [removeUser, setRemoveUser] = useState<Profile | null>(null);
  const [listingCount, setListingCount] = useState(0);
  const [transferToId, setTransferToId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const openWhatsappBulk = () => {
    setWhatsappMessage("");
    setWhatsappLinks([]);
    setWhatsappModalOpen(true);
  };

  const sendWhatsappBulk = () => {
    const withPhone = users.filter(
      (u) => u.whatsapp_number && u.whatsapp_number.replace(/\D/g, "").length >= 10
    );
    const text = whatsappMessage.trim()
      ? encodeURIComponent(whatsappMessage.trim())
      : "";
    const links = withPhone.map((u) => {
      const num = u.whatsapp_number!.replace(/\D/g, "").replace(/^0/, "");
      return {
        name: u.full_name || u.whatsapp_number || num,
        url: `https://wa.me/90${num}${text ? `?text=${text}` : ""}`,
      };
    });
    setWhatsappLinks(links);
    // Otomatik pencere açma yok; tarayıcı engelliyor. Kullanıcı aşağıdaki linklere tek tek tıklar.
  };

  const openRemoveModal = async (user: Profile) => {
    const { count, error } = await supabaseBrowserClient
      .from("sbo_listings")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setListingCount(count ?? 0);
    setRemoveUser(user);
    setTransferToId("");
    setRemoveStep("confirm");
    setRemoveModalOpen(true);
  };

  const confirmRemoveAndTransfer = async () => {
    if (!removeUser) return;
    setLoading(true);
    setMessage(null);

    if (listingCount > 0 && transferToId) {
      const { error: updateError } = await supabaseBrowserClient
        .from("sbo_listings")
        .update({ created_by: transferToId })
        .eq("created_by", removeUser.id);

      if (updateError) {
        console.error(updateError);
        setMessage("İlanlar aktarılırken hata oluştu. Veritabanı izni (RLS) kontrol edin.");
        setLoading(false);
        return;
      }
    }

    const { error } = await supabaseBrowserClient
      .from("sbo_profiles")
      .update({ role: "musteri" })
      .eq("id", removeUser.id);

    if (error) {
      console.error(error);
      setMessage("Kullanıcı güncellenirken hata oluştu. Veritabanı izni (RLS) kontrol edin.");
      setLoading(false);
      return;
    }

    setRemoveModalOpen(false);
    setRemoveUser(null);
    setTransferToId("");
    setRemoveStep("confirm");
    setMessage("Satış elemanı çıkarıldı." + (transferToId ? " İlanlar aktarıldı." : ""));
    void fetchUsers();
    setLoading(false);
  };

  const usersForTransfer = users.filter(
    (u) => u.id !== removeUser?.id && u.role === "satis-elemani"
  );

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Kullanıcılar</h1>
          <p className="text-xs text-slate-600">
            Tüm kullanıcıları görüntüleyebilir, rollerini güncelleyebilir veya
            satış elemanını çıkarıp ilanlarını başka kullanıcıya aktarabilirsiniz.
          </p>
        </div>
        <button
          type="button"
          onClick={openWhatsappBulk}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100"
        >
          <i className="fa-brands fa-whatsapp text-lg" />
          WhatsApp Toplu Mesaj
        </button>
      </header>

      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Ad Soyad</th>
              <th className="px-3 py-2">Kullanıcı ID</th>
              <th className="px-3 py-2">Rol</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Oluşturulma</th>
              <th className="px-3 py-2">İşlem</th>
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
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => openRemoveModal(user)}
                    className="shrink-0 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-4 text-center text-xs text-slate-500"
                >
                  Henüz profil kaydı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* WhatsApp Toplu Mesaj modal */}
      {whatsappModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setWhatsappModalOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-900">
              WhatsApp Toplu Mesaj
            </h3>
            <p className="mt-1 text-[11px] text-slate-600">
              Telefon numarası kayıtlı kullanıcılar için WhatsApp pencereleri
              açılacak. İsterseniz aşağıya yazdığınız mesaj her sohbette önceden
              doldurulur (her biri ayrı sekmede açılır).
            </p>
            <textarea
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={3}
              placeholder="Opsiyonel: Toplu mesaj metni..."
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {whatsappLinks.length > 0 ? (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-slate-600">
                  {whatsappLinks.length} kişiye mesaj atmak için aşağıdaki linklere tek tek tıklayın (her tıklamada o kişiyle WhatsApp açılır):
                </p>
                <ul className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
                  {whatsappLinks.map((link, i) => (
                    <li key={i} className="mt-1 first:mt-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 underline hover:text-emerald-800"
                      >
                        <i className="fa-brands fa-whatsapp" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => { setWhatsappLinks([]); setWhatsappModalOpen(false); }}
                  className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWhatsappModalOpen(false)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={sendWhatsappBulk}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <i className="fa-brands fa-whatsapp" />
                  Toplu mesaj göndere aç
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Sil: 1) Emin misin? 2) İlanları kime aktaralım? */}
      {removeModalOpen && removeUser && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() =>
              !loading &&
              (setRemoveModalOpen(false),
                setRemoveUser(null),
                setRemoveStep("confirm"),
                setTransferToId(""))
            }
            aria-hidden="true"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            {removeStep === "confirm" ? (
              <>
                <h3 className="text-sm font-semibold text-slate-900">
                  Emin misiniz?
                </h3>
                <p className="mt-2 text-xs text-slate-600">
                  <strong>{removeUser.full_name || removeUser.id}</strong>{" "}
                  kullanıcısını satış elemanı olmaktan çıkaracaksınız.
                  {listingCount > 0 && (
                    <> Bu kullanıcının <strong>{listingCount} ilanı</strong> var.</>
                  )}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setRemoveModalOpen(false);
                      setRemoveUser(null);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Hayır
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (listingCount > 0 && usersForTransfer.length > 0) {
                        setRemoveStep("transfer");
                      } else {
                        void confirmRemoveAndTransfer();
                      }
                    }}
                    className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Evet
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-slate-900">
                  İlanları kime aktaralım?
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  {removeUser.full_name || removeUser.id} kullanıcısının{" "}
                  {listingCount} ilanı var. Aktarılan kişi ilanları &quot;İlanlarım&quot;
                  sayfasında görecek; ilan detayında onun iletişim bilgisi görünecek.
                </p>
                <div className="mt-3">
                  <label className="block text-[11px] font-medium text-slate-600">
                    Satış elemanı seçin
                  </label>
                  <select
                    value={transferToId}
                    onChange={(e) => setTransferToId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Seçiniz</option>
                    {usersForTransfer.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name || u.whatsapp_number || u.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setRemoveStep("confirm");
                      setTransferToId("");
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    disabled={loading || !transferToId}
                    onClick={() => void confirmRemoveAndTransfer()}
                    className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "İşleniyor..." : "Aktar ve Sil"}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
