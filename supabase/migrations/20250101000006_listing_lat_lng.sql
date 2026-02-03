-- Yakınımdaki ilanlar filtresi için konum alanları (opsiyonel)
ALTER TABLE sbo_listings
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

COMMENT ON COLUMN sbo_listings.latitude IS 'Enlem - yakınımdaki ilanlar filtresi için';
COMMENT ON COLUMN sbo_listings.longitude IS 'Boylam - yakınımdaki ilanlar filtresi için';
