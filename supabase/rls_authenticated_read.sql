-- Giriş yapmış kullanıcılar (admin, satis-elemani, musteri) veri okuyabilsin
-- Sorun: Anon veri çekebiliyor, admin/satis-elemani çekemiyor → authenticated için SELECT policy eksik.
-- Çözüm: Bu dosyayı Supabase SQL Editor'da çalıştırın (önce bunu, sonra rls_admin_sil_ve_aktar.sql).

-- 1) sbo_listings: Giriş yapmış herkes ilanları okuyabilsin (ana sayfa, ilan detay, ilanlarım, admin ilanlar)
DROP POLICY IF EXISTS "Authenticated can read listings" ON sbo_listings;
CREATE POLICY "Authenticated can read listings"
  ON sbo_listings FOR SELECT
  TO authenticated
  USING (true);

-- 2) sbo_profiles: Her giriş yapmış kullanıcı kendi profilini okuyabilsin (giriş sonrası rol için gerekli)
DROP POLICY IF EXISTS "Users can read own profile" ON sbo_profiles;
CREATE POLICY "Users can read own profile"
  ON sbo_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 3) sbo_profiles: Admin tüm profilleri okuyabilsin (Kullanıcılar sayfası, aktarım dropdown)
DROP POLICY IF EXISTS "Admin can read all profiles" ON sbo_profiles;
CREATE POLICY "Admin can read all profiles"
  ON sbo_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
