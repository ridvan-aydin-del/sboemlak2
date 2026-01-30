-- Admin: Satış danışmanı silme ve ilan aktarma için RLS politikaları
-- Supabase SQL Editor'da çalıştırın.
-- Not: "policy already exists" hatası alırsanız, aynı isimde policy var demektir; ismi değiştirin veya DROP POLICY ... ile kaldırıp tekrar ekleyin.

-- 1) sbo_profiles: Admin herhangi bir kullanıcının rolünü güncelleyebilsin (Sil = role -> musteri)
CREATE POLICY "Admin can update any profile role"
  ON sbo_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 2) sbo_listings: Admin, ilanların created_by alanını güncelleyebilsin (aktarım)
CREATE POLICY "Admin can update listing created_by"
  ON sbo_listings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 3) sbo_listings: Admin ilan sayısını alabilsin (Sil modal'da "X ilanı var" ve aktarım listesi için)
CREATE POLICY "Admin can select listings for count"
  ON sbo_listings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 4) sbo_profiles: Admin tüm kullanıcıları görebilsin (Kullanıcılar sayfası ve aktarım dropdown için)
CREATE POLICY "Admin can select all profiles"
  ON sbo_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
