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

export interface AdminUser {
  id: string;
  user_id: string;
  permissions: string[];
  last_login: Date;
  created_at: Date;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'order_debit' | 'refund' | 'bonus' | 'manual';
  reference_id: string | null;
  description: string | null;
  balance_after: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

export interface Provider {
  id: string;
  name: string;
  api_url: string;
  api_key: string | null;
  api_secret: string | null;
  type: string;
  status: 'active' | 'inactive' | 'error';
  config: any;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: Date;
}

export interface Service {
  id: string;
  provider_id: string;
  provider_service_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  min: number;
  max: number;
  rate: number;
  cost: number;
  profit: number;
  margin_percent: number | null;
  margin_fixed: number | null;
  provider_service_category: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  service_id: string;
  provider_order_id: string | null;
  quantity: number;
  link: string;
  price: number;
  cost: number;
  profit: number;
  status: 'pending' | 'processing' | 'in_progress' | 'completed' | 'partial' | 'canceled' | 'refunded';
  start_count: number | null;
  current_count: number | null;
  remains: number | null;
  provider_response: any;
  created_at: Date;
  updated_at: Date;
}

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  method: 'flutterwave' | 'korapay' | 'manual' | 'bank_transfer';
  status: 'pending' | 'approved' | 'rejected' | 'failed';
  reference: string | null;
  payment_link: string | null;
  proof_url: string | null;
  admin_notes: string | null;
  approved_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: Date;
  updated_at: Date;
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: Date;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  earnings: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  expires_at: Date | null;
  status: 'active' | 'expired' | 'disabled';
  created_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  details: any;
  ip: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface EmailVerification {
  id: string;
  user_id: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export interface PasswordReset {
  id: string;
  user_id: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  updated_at: Date;
}

export interface ApiLog {
  id: string;
  provider_id: string;
  endpoint: string;
  request_body: any;
  response_body: any;
  status_code: number;
  duration_ms: number;
  created_at: Date;
}
