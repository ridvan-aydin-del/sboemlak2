export type UserRole = "admin" | "satis-elemani" | "musteri";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  whatsapp_number: string | null;
}

