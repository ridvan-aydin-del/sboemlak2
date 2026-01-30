-- Spam engellemek için IP kolonu (sbo_customer_requests tablosuna)
-- Supabase SQL Editor'da çalıştırın.

ALTER TABLE sbo_customer_requests
ADD COLUMN IF NOT EXISTS ip_address inet;

COMMENT ON COLUMN sbo_customer_requests.ip_address IS 'Spam / kötüye kullanım takibi için (isteğe bağlı)';
