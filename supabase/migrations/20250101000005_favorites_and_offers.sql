-- Favoriye Ekle (isim, telefon) – admin/satis elemanı görsün
CREATE TABLE IF NOT EXISTS sbo_listing_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES sbo_listings(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sbo_listing_favorites ENABLE ROW LEVEL SECURITY;

-- Anonim insert (API üzerinden)
CREATE POLICY "Allow insert listing favorites" ON sbo_listing_favorites
  FOR INSERT TO anon WITH CHECK (true);

-- Sadece admin ve satış elemanı okuyabilsin
CREATE POLICY "Admin and sales can read favorites" ON sbo_listing_favorites
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'satis-elemani')
    )
  );

COMMENT ON TABLE sbo_listing_favorites IS 'Favoriye ekleyen kişi bilgileri (isim, telefon) – admin/satis sayfasında listelenir';

-- Teklif Ver (isim, telefon, teklif tutarı) – IP: toplam 4 teklif, her ilana 1
CREATE TABLE IF NOT EXISTS sbo_listing_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES sbo_listings(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  offer_amount bigint NOT NULL,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sbo_listing_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert listing offers" ON sbo_listing_offers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admin and sales can read offers" ON sbo_listing_offers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sbo_profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'satis-elemani')
    )
  );

COMMENT ON TABLE sbo_listing_offers IS 'Teklif veren kişi bilgileri – IP başına toplam 4, her ilana 1 teklif (API’de kontrol)';
