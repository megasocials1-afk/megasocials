export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  balance: number;
  status: 'active' | 'suspended' | 'banned';
  referral_code: string;
  referred_by: string | null;
  email_verified: boolean;
  role: 'user' | 'admin' | 'super_admin';
  suspension_reason?: string;
  suspended_by?: string;
  banned_at?: Date;
  created_at: Date;
  updated_at: Date;
}
