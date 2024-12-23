export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'resident' | 'business' | 'authority';
  email?: string;
  avatar?: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}
