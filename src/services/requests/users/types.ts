export interface User {
  id: string;
  name: string;
  email: string;
  doc?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  linkedIn?: string | null;
  companies?: any[];
  companies_ids?: string[];
  status: 'US1' | 'US2' | 'US3';
  hashedRefreshToken: string | null;
  profile: 'ADMIN' | 'MEMBER';
  permissions: 'WEB' | 'MOBILE';
  created_at: Date;
  updated_at: Date;
  canceled_at: Date;
}

export interface Guest extends Omit<User, 'profile'> {
  profile: 'GS1' | 'GS2';
}

export interface GuestToSelectNote extends Guest {
  selectedNote: boolean;
}

export interface GuestToSelect extends Guest {
  selected: boolean;
}
