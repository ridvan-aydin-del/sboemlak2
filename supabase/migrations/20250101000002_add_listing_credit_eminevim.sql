-- Kredi limiti ve Eminevim/Fuzul Evim uygunluk alanları
ALTER TABLE sbo_listings
ADD COLUMN IF NOT EXISTS credit_limit bigint,
ADD COLUMN IF NOT EXISTS eminevim_fuzul_evim_uygun boolean DEFAULT false;

COMMENT ON COLUMN sbo_listings.credit_limit IS 'Kredi limiti (TL)';
COMMENT ON COLUMN sbo_listings.eminevim_fuzul_evim_uygun IS 'Eminevim / Fuzul Evim kredisine uygun mu';
