export interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  profile: 'ADMIN' | 'MEMBER';
  permissions: 'WEB' | 'MOBILE';
  avatarUrl: string | null;
  created_at: Date;
  updated_at: Date | null;
  canceled_at: Date | null;
}

export interface UserPost {
  name: string;
  email: string;
  status: boolean;
  profile: 'ADMIN' | 'MEMBER';
  permissions: 'WEB' | 'MOBILE';
  avatarUrl: string | null;
  canceled_at: Date | null;
}

export interface UserPut extends UserPost {
  id: string;
}
