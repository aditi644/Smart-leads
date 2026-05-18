// ─── Enums ────────────────────────────────────────────────────────────────────

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

// ─── Entity Types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface LeadFilters {
  page: number;
  limit: number;
  status: string;
  source: string;
  search: string;
  sort: 'latest' | 'oldest';
}

export interface LeadStats {
  total: number;
  statusStats: { _id: string; count: number }[];
  sourceStats: { _id: string; count: number }[];
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LeadForm {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes: string;
}
