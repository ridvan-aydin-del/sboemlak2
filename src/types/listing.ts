export type ListingType = "satilik" | "kiralik" | "devren-satilik";

export type ListingCategory = "konut" | "isYeri" | "arsa";

export type ListingDetailType =
  | "daire"
  | "rezidans"
  | "mustakil-ev"
  | "villa"
  | "yazlik";

export type ParkingType = "acik" | "kapali" | "yok";

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: ListingType;
  category: ListingCategory;
  images: string[] | null;
  created_by: string;
  created_at: string;
  floor: string | null;
  heating: string | null;
  building_age: string | null;
  featured: boolean;
  net_area: number | null;
  gross_area: number | null;
  total_floors: number | null;
  bathroom_count: number | null;
  has_balcony: boolean | null;
  has_elevator: boolean | null;
  parking_type: ParkingType | null;
  is_furnished: boolean | null;
  usage_status: string | null;
  is_credit_eligible: boolean | null;
  credit_limit: number | null;
  eminevim_fuzul_evim_uygun: boolean | null;
  deed_status: string | null;
  duess: number | null;
  rooms: string | null;
  neighborhood: string | null;
  province: string | null;
  district: string | null;
  detail_type: ListingDetailType | null;
  is_active: boolean;
  contact_number: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  commission_type?: "dahil" | "haric" | null;
  seller_note?: string | null;
  admin_note?: string | null;
  /** Admin notu - sadece admin görür (DB: gizli_not) */
  gizli_not?: string | null;
  /** Yakınımdaki ilanlar filtresi için (opsiyonel) */
  latitude?: number | null;
  longitude?: number | null;
}

