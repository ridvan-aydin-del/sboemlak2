-- Müşteri talep formu (ilan bulamadınız) - spam engelleme için ip
CREATE TABLE IF NOT EXISTS sbo_customer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  listing_type text NOT NULL CHECK (listing_type IN ('satilik', 'kiralik')),
  property_type text NOT NULL CHECK (property_type IN ('konut', 'isYeri', 'arsa')),
  min_budget bigint,
  max_budget bigint,
  note text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Anonim kullanıcılar insert yapamasın; API üzerinden insert yapılacak (service role)
ALTER TABLE sbo_customer_requests ENABLE ROW LEVEL SECURITY;

-- API route (server) anon key ile insert yapacak; istemci direkt bu tabloya yazmasın
-- Not: İstemci sadece /api/customer-request üzerinden gönderir, API IP ekleyip insert eder
CREATE POLICY "Allow insert for customer requests" ON sbo_customer_requests
  FOR INSERT TO anon WITH CHECK (true);

COMMENT ON COLUMN sbo_customer_requests.ip_address IS 'Spam / kötüye kullanım takibi için (KVKK uyumlu saklama)';
