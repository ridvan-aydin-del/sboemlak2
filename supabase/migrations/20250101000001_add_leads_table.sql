-- İlan talep formu (giriş yapmamış kullanıcılar)
CREATE TABLE IF NOT EXISTS sbo_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  type text NOT NULL CHECK (type IN ('satilik', 'kiralik')),
  category text NOT NULL CHECK (category IN ('konut', 'isYeri', 'arsa')),
  budget_min bigint,
  budget_max bigint,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Anonim kullanıcılar lead ekleyebilsin
ALTER TABLE sbo_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON sbo_leads FOR INSERT TO anon WITH CHECK (true);
