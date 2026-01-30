-- Müşteri bilgileri ve not alanları
ALTER TABLE sbo_listings
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS commission_type text CHECK (commission_type IN ('dahil', 'haric')),
ADD COLUMN IF NOT EXISTS seller_note text,
ADD COLUMN IF NOT EXISTS admin_note text;
