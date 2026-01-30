-- Admin notu (sadece admin görür) - satış danışmanı görmez
ALTER TABLE sbo_listings
ADD COLUMN IF NOT EXISTS gizli_not text;

COMMENT ON COLUMN sbo_listings.gizli_not IS 'Admin notu - sadece admin görür, satış danışmanı görmez';
