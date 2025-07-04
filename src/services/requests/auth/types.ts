import { type ReactNode } from 'react';

import { type User } from '../users/types';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthState extends Tokens {
  user: any;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextData {
  user: User;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

export interface AuthContextProps {
  children: ReactNode;
}

export interface ForgotPasswordProps {
  email: string;
}

export interface UpdatePassword {
  email: string;
  password: string;
  old_password: string;
}
